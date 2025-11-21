package com.mackimoveis.vfinal.controller;

import com.mackimoveis.vfinal.model.Propriedade;
import com.mackimoveis.vfinal.model.Reserva;
import com.mackimoveis.vfinal.model.Usuario;
import com.mackimoveis.vfinal.repository.ReservaRepository;
import com.mackimoveis.vfinal.repository.UsuarioRepository;
import com.mackimoveis.vfinal.repository.PropriedadeRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/reservas")
@CrossOrigin(origins = {"http://localhost:8080", "http://127.0.0.1:8080"}, allowCredentials = "true")
public class ReservaController {
    
    private final ReservaRepository reservaRepository;
    private final UsuarioRepository usuarioRepository;
    private final PropriedadeRepository propriedadeRepository;

    @Autowired
    public ReservaController(ReservaRepository reservaRepository, 
                            UsuarioRepository usuarioRepository, 
                            PropriedadeRepository propriedadeRepository) {
        this.reservaRepository = reservaRepository;
        this.usuarioRepository = usuarioRepository;
        this.propriedadeRepository = propriedadeRepository;
    }
    
    @PostMapping
    @Transactional
    public ResponseEntity<?> fazerReserva(@Valid @RequestBody Reserva reserva, 
                                                 @RequestParam Long inquilinoId, 
                                                 @RequestParam Long propriedadeId) {
        Usuario inquilino = usuarioRepository.findById(inquilinoId).orElse(null);
        if (inquilino == null) {
            Map<String, String> erro = new HashMap<>();
            erro.put("erro", "Usuário não encontrado!");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(erro);
        }
        
        Propriedade propriedade = propriedadeRepository.findById(propriedadeId).orElse(null);
        if (propriedade == null) {
            Map<String, String> erro = new HashMap<>();
            erro.put("erro", "Propriedade não encontrada!");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(erro);
        }
        
        if (!propriedade.isDisponivel()) {
            Map<String, String> erro = new HashMap<>();
            erro.put("erro", "Propriedade não disponível para reserva!");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(erro);
        }

        LocalDate hoje = LocalDate.now();
        if (reserva.getDataCheckin().isBefore(hoje)) {
            Map<String, String> erro = new HashMap<>();
            erro.put("erro", "Data de check-in não pode ser no passado!");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(erro);
        }
        
        if (reserva.getDataCheckout().isBefore(reserva.getDataCheckin()) || 
            reserva.getDataCheckout().isEqual(reserva.getDataCheckin())) {
            Map<String, String> erro = new HashMap<>();
            erro.put("erro", "Data de check-out deve ser posterior à data de check-in!");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(erro);
        }

        // Verificar conflitos de reserva
        List<Reserva> reservasExistentes = reservaRepository.findByPropriedade_Id(propriedadeId);
        for (Reserva r : reservasExistentes) {
            if (datasConflitantes(reserva.getDataCheckin(), reserva.getDataCheckout(),
                                 r.getDataCheckin(), r.getDataCheckout())) {
                Map<String, String> erro = new HashMap<>();
                erro.put("erro", "Propriedade já está reservada para essas datas!");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(erro);
            }
        }

        long numeroNoites = ChronoUnit.DAYS.between(reserva.getDataCheckin(), reserva.getDataCheckout());
        double custoTotal = numeroNoites * propriedade.getPrecoPorNoite();
        reserva.setInquilino(inquilino);
        reserva.setPropriedade(propriedade);
        reserva.setCustoTotal(custoTotal);
        propriedade.setDisponivel(false);
        propriedadeRepository.save(propriedade);
        
        inquilino.setInquilino(true);
        usuarioRepository.save(inquilino);
        
        Reserva novaReserva = reservaRepository.save(reserva);
        return ResponseEntity.status(HttpStatus.CREATED).body(novaReserva);
    }

    // verificar se há conflito de datas
    private boolean datasConflitantes(LocalDate checkin1, LocalDate checkout1, 
                                     LocalDate checkin2, LocalDate checkout2) {
        return !(checkout1.isBefore(checkin2) || checkin1.isAfter(checkout2));
    }

    @GetMapping
    public ResponseEntity<List<Reserva>> listarReservasDoInquilino(@RequestParam Long inquilinoId) {
        List<Reserva> lista = reservaRepository.findByInquilino_Id(inquilinoId);
        return ResponseEntity.ok(lista);
    }

    @GetMapping("/buscar")
    public ResponseEntity<?> buscarPropriedadesDisponiveis(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dataCheckin,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dataCheckout,
            @RequestParam(required = false) String localizacao) {
        
        if (dataCheckin != null && dataCheckout != null) {
            if (dataCheckout.isBefore(dataCheckin) || dataCheckout.isEqual(dataCheckin)) {
                Map<String, String> erro = new HashMap<>();
                erro.put("erro", "Data de check-out deve ser posterior à data de check-in!");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(erro);
            }
        }

        List<Propriedade> propriedades = propriedadeRepository.findAll();
        
        List<Propriedade> resultado = propriedades.stream()
            .filter(p -> p.isDisponivel())
            .filter(p -> localizacao == null || localizacao.isEmpty() || 
                        (p.getLocalizacao() != null && 
                         p.getLocalizacao().toLowerCase().contains(localizacao.toLowerCase())))
            .filter(p -> {
                if (dataCheckin != null && dataCheckout != null) {
                    return estaDisponivelParaDatas(p.getId(), dataCheckin, dataCheckout);
                }
                return true;
            })
            .collect(Collectors.toList());
        
        return ResponseEntity.ok(resultado);
    }

    private boolean estaDisponivelParaDatas(Long propriedadeId, LocalDate checkin, LocalDate checkout) {
        List<Reserva> reservas = reservaRepository.findByPropriedade_Id(propriedadeId);
        for (Reserva reserva : reservas) {
            if (datasConflitantes(checkin, checkout, reserva.getDataCheckin(), reserva.getDataCheckout())) {
                return false;
            }
        }
        return true;
    }

    @DeleteMapping("/{id}")
    @Transactional
    public ResponseEntity<?> deletarReserva(@PathVariable Long id, @RequestParam Long inquilinoId) {
        Reserva reserva = reservaRepository.findById(id).orElse(null);
        if (reserva == null) {
            Map<String, String> erro = new HashMap<>();
            erro.put("erro", "Reserva não encontrada!");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(erro);
        }
        
        // Verificar se o usuário é o inquilino que fez a reserva
        if (reserva.getInquilino() == null || !reserva.getInquilino().getId().equals(inquilinoId)) {
            Map<String, String> erro = new HashMap<>();
            erro.put("erro", "Você não tem permissão para cancelar esta reserva!");
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(erro);
        }
        
        Propriedade propriedade = reserva.getPropriedade();
        reservaRepository.delete(reserva);
        
        List<Reserva> outrasReservas = reservaRepository.findByPropriedade_Id(propriedade.getId());
        if (outrasReservas.isEmpty()) {
            propriedade.setDisponivel(true);
            propriedadeRepository.save(propriedade);
        }
        
        return ResponseEntity.noContent().build();
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
