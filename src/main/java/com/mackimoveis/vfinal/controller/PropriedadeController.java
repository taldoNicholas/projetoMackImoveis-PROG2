package com.mackimoveis.vfinal.controller;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.mackimoveis.vfinal.model.Propriedade;
import com.mackimoveis.vfinal.model.Reserva;
import com.mackimoveis.vfinal.model.Usuario;
import com.mackimoveis.vfinal.repository.PropriedadeRepository;
import com.mackimoveis.vfinal.repository.ReservaRepository;
import com.mackimoveis.vfinal.repository.UsuarioRepository;

import jakarta.validation.Valid;


@RestController
@RequestMapping("/propriedades")
@CrossOrigin(origins = {"http://localhost:8080", "http://127.0.0.1:8080"}, allowCredentials = "true")
public class PropriedadeController {
    private final PropriedadeRepository propriedadeRepository;
    private final UsuarioRepository usuarioRepository;
    private final ReservaRepository reservaRepository;

    @Autowired
    public PropriedadeController(PropriedadeRepository propriedadeRepository, 
                                UsuarioRepository usuarioRepository,
                                ReservaRepository reservaRepository) {
        this.propriedadeRepository = propriedadeRepository;
        this.usuarioRepository = usuarioRepository;
        this.reservaRepository = reservaRepository;
    }
    
    @GetMapping
    public ResponseEntity<List<Propriedade>> listarTodas() {
        List<Propriedade> lista = propriedadeRepository.findAll();
        return ResponseEntity.ok(lista);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<?> buscarPorId(@PathVariable Long id) {
        Propriedade propriedade = propriedadeRepository.findById(id).orElse(null);
        if (propriedade == null) {
            Map<String, String> erro = new HashMap<>();
            erro.put("erro", "Propriedade não encontrada!");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(erro);
        }
        return ResponseEntity.ok(propriedade);
    }
    
    @GetMapping("/disponiveis")
    public ResponseEntity<List<Propriedade>> listarDisponiveis() {
        List<Propriedade> lista = propriedadeRepository.findByDisponivel(true);
        return ResponseEntity.ok(lista);
    }
    
    @GetMapping("/buscar")
    public ResponseEntity<List<Propriedade>> buscarPorLocalizacao(@RequestParam(required = false) String localizacao) {
        List<Propriedade> lista;
        if (localizacao != null && !localizacao.isEmpty()) {
            lista = propriedadeRepository.findAll().stream()
                .filter(p -> p.getLocalizacao() != null && 
                            p.getLocalizacao().toLowerCase().contains(localizacao.toLowerCase()))
                .collect(Collectors.toList());
        } else {
            lista = propriedadeRepository.findAll();
        }
        return ResponseEntity.ok(lista);
    }
    
    // cadastrar propriedade
    @PostMapping
    @Transactional
    public ResponseEntity<?> cadastrarPropriedade(@Valid @RequestBody Propriedade propriedade, 
                                                              @RequestParam Long proprietarioId) {
        Usuario dono = usuarioRepository.findById(proprietarioId).orElse(null);
        if (dono == null) {
            Map<String, String> erro = new HashMap<>();
            erro.put("erro", "Usuário não encontrado!");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(erro);
        }
        propriedade.setProprietario(dono);
        propriedade.setDisponivel(true);
        
        dono.setProprietario(true);
        usuarioRepository.save(dono);
        
        Propriedade novaPropriedade = propriedadeRepository.save(propriedade);
        return ResponseEntity.status(HttpStatus.CREATED).body(novaPropriedade);
    }

    @PutMapping("/{id}")
    @Transactional
    public ResponseEntity<?> atualizarPropriedade(@PathVariable Long id, 
                                                             @Valid @RequestBody Propriedade propriedadeAtualizada,
                                                             @RequestParam Long proprietarioId) {
        Propriedade propriedade = propriedadeRepository.findById(id).orElse(null);
        if (propriedade == null) {
            Map<String, String> erro = new HashMap<>();
            erro.put("erro", "Propriedade não encontrada!");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(erro);
        }
        
        // Verificar se o usuário é o proprietário
        if (propriedade.getProprietario() == null || !propriedade.getProprietario().getId().equals(proprietarioId)) {
            Map<String, String> erro = new HashMap<>();
            erro.put("erro", "Você não tem permissão para editar esta propriedade!");
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(erro);
        }
        
        // Verificar se a propriedade está reservada
        List<Reserva> reservas = reservaRepository.findByPropriedade_Id(id);
        LocalDate hoje = LocalDate.now();
        boolean temReservaAtiva = reservas.stream()
            .anyMatch(r -> r.getDataCheckout().isAfter(hoje) || r.getDataCheckout().isEqual(hoje));
        
        if (temReservaAtiva) {
            Map<String, String> erro = new HashMap<>();
            erro.put("erro", "Não é possível editar uma propriedade que está reservada!");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(erro);
        }
        
        propriedade.setTitulo(propriedadeAtualizada.getTitulo());
        propriedade.setDescricao(propriedadeAtualizada.getDescricao());
        propriedade.setLocalizacao(propriedadeAtualizada.getLocalizacao());
        propriedade.setCapacidade(propriedadeAtualizada.getCapacidade());
        propriedade.setPrecoPorNoite(propriedadeAtualizada.getPrecoPorNoite());
        propriedade.setFotos(propriedadeAtualizada.getFotos());
        Propriedade atualizada = propriedadeRepository.save(propriedade);
        return ResponseEntity.ok(atualizada);
    }

    @DeleteMapping("/{id}")
    @Transactional
    public ResponseEntity<?> deletarPropriedade(@PathVariable Long id, @RequestParam Long proprietarioId) {
        Propriedade propriedade = propriedadeRepository.findById(id).orElse(null);
        if (propriedade == null) {
            Map<String, String> erro = new HashMap<>();
            erro.put("erro", "Propriedade não encontrada!");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(erro);
        }
        
        // Verificar se o usuário é o proprietário
        if (propriedade.getProprietario() == null || !propriedade.getProprietario().getId().equals(proprietarioId)) {
            Map<String, String> erro = new HashMap<>();
            erro.put("erro", "Você não tem permissão para remover esta propriedade!");
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(erro);
        }
        
        // Verificar se a propriedade está reservada
        List<Reserva> reservas = reservaRepository.findByPropriedade_Id(id);
        LocalDate hoje = LocalDate.now();
        boolean temReservaAtiva = reservas.stream()
            .anyMatch(r -> r.getDataCheckout().isAfter(hoje) || r.getDataCheckout().isEqual(hoje));
        
        if (temReservaAtiva) {
            Map<String, String> erro = new HashMap<>();
            erro.put("erro", "Não é possível remover uma propriedade que está reservada!");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(erro);
        }
        
        // Deletar todas as reservas relacionadas primeiro
        reservaRepository.deleteAll(reservas);
        propriedadeRepository.delete(propriedade);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/alugadas")
    public ResponseEntity<List<Propriedade>> listarAlugadas(@RequestParam Long proprietarioId) {
        List<Propriedade> minhasPropriedades = propriedadeRepository.findByProprietario_Id(proprietarioId);
        List<Propriedade> alugadas = minhasPropriedades.stream()
            .filter(prop -> !prop.isDisponivel())
            .collect(Collectors.toList());
        alugadas.forEach(prop -> preencherReservaAtiva(prop));
        return ResponseEntity.ok(alugadas);
    }

    // listar propriedades por proprietario
    @GetMapping("/minhas")
    public ResponseEntity<List<Propriedade>> listarMinhasPropriedades(@RequestParam Long proprietarioId) {
        List<Propriedade> propriedades = propriedadeRepository.findByProprietario_Id(proprietarioId);
        propriedades.forEach(prop -> {
            if (!prop.isDisponivel()) {
                preencherReservaAtiva(prop);
            }
        });
        return ResponseEntity.ok(propriedades);
    }
    
    private void preencherReservaAtiva(Propriedade propriedade) {
        List<Reserva> reservas = reservaRepository.findByPropriedade_Id(propriedade.getId());
        LocalDate hoje = LocalDate.now();
        Reserva reservaAtiva = reservas.stream()
            .filter(r -> r.getDataCheckout().isAfter(hoje) || r.getDataCheckout().isEqual(hoje))
            .findFirst()
            .orElse(null);
        
        if (reservaAtiva != null && reservaAtiva.getInquilino() != null) {
            Usuario inquilino = reservaAtiva.getInquilino();
            long dias = ChronoUnit.DAYS.between(reservaAtiva.getDataCheckin(), reservaAtiva.getDataCheckout());
            Propriedade.ReservaInfo reservaInfo = new Propriedade.ReservaInfo(
                reservaAtiva.getId(),
                inquilino.getNome(),
                inquilino.getEmail(),
                reservaAtiva.getDataCheckin().toString(),
                reservaAtiva.getDataCheckout().toString(),
                dias
            );
            propriedade.setReservaAtiva(reservaInfo);
        }
    }
    
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> handleValidationExceptions(MethodArgumentNotValidException e) {
        Map<String, String> erros = new HashMap<>();
        e.getBindingResult().getAllErrors().forEach((error) -> {
            String campo = ((FieldError) error).getField();
            String mensagem = error.getDefaultMessage();
            erros.put(campo, mensagem);
        });
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(erros);
    }
}
