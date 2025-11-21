package com.mackimoveis.vfinal.controller;

import com.mackimoveis.vfinal.model.Usuario;
import com.mackimoveis.vfinal.repository.UsuarioRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/usuarios")
@CrossOrigin(origins = {"http://localhost:8080", "http://127.0.0.1:8080"}, allowCredentials = "true")
public class UsuarioController {
    private final UsuarioRepository usuarioRepository;

    @Autowired
    public UsuarioController(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }
    
    // Método privado para criptografar senha com SHA-256
    private String criptografarSenha(String senha) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(senha.getBytes(StandardCharsets.UTF_8));
            
            StringBuilder hexString = new StringBuilder();
            for (byte b : hash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) {
                    hexString.append('0');
                }
                hexString.append(hex);
            }
            return hexString.toString();
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("Erro ao criptografar senha", e);
        }
    }
    
    // Método privado para verificar senha
    private boolean verificarSenha(String senhaPlana, String senhaCriptografada) {
        String senhaHash = criptografarSenha(senhaPlana);
        return senhaHash.equals(senhaCriptografada);
    }
    
    // cadastrar usuario (genérico - sem flags iniciais)
    @PostMapping
    public ResponseEntity<?> cadastrarUsuario(@Valid @RequestBody Usuario usuario){
        if (usuarioRepository.findByEmail(usuario.getEmail()).isPresent()) {
            Map<String, String> erro = new HashMap<>();
            erro.put("erro", "Email já cadastrado!");
            return ResponseEntity.status(HttpStatus.CONFLICT).body(erro);
        }
        // Criptografar senha antes de salvar
        usuario.setSenha(criptografarSenha(usuario.getSenha()));
        usuario.setProprietario(false);
        usuario.setInquilino(false);
        Usuario novo = usuarioRepository.save(usuario);
        return ResponseEntity.status(HttpStatus.CREATED).body(novo);
    }
    
    @PostMapping("/proprietario")
    public ResponseEntity<?> cadastrarProprietario(@Valid @RequestBody Usuario usuario){
        if (usuarioRepository.findByEmail(usuario.getEmail()).isPresent()) {
            Map<String, String> erro = new HashMap<>();
            erro.put("erro", "Email já cadastrado!");
            return ResponseEntity.status(HttpStatus.CONFLICT).body(erro);
        }
        // Criptografar senha antes de salvar
        usuario.setSenha(criptografarSenha(usuario.getSenha()));
        usuario.setProprietario(true);
        usuario.setInquilino(false);
        Usuario novo = usuarioRepository.save(usuario);
        return ResponseEntity.status(HttpStatus.CREATED).body(novo);
    }

    @PostMapping("/inquilino")
    public ResponseEntity<?> cadastrarInquilino(@Valid @RequestBody Usuario usuario){
        Optional<Usuario> usuarioExistente = usuarioRepository.findByEmail(usuario.getEmail());
        if (usuarioExistente.isPresent()) {
            // Se já existe, apenas atualiza a flag de inquilino
            Usuario existente = usuarioExistente.get();
            existente.setInquilino(true);
            existente.setNome(usuario.getNome());
            // Criptografar senha antes de atualizar
            existente.setSenha(criptografarSenha(usuario.getSenha()));
            Usuario atualizado = usuarioRepository.save(existente);
            return ResponseEntity.status(HttpStatus.CREATED).body(atualizado);
        }
        // Criptografar senha antes de salvar
        usuario.setSenha(criptografarSenha(usuario.getSenha()));
        usuario.setProprietario(false);
        usuario.setInquilino(true);
        Usuario novo = usuarioRepository.save(usuario);
        return ResponseEntity.status(HttpStatus.CREATED).body(novo);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> dadosLogin){
        String email = dadosLogin.get("email");
        String senha = dadosLogin.get("senha");
        
        Optional<Usuario> usuario = usuarioRepository.findByEmail(email);
        
        if (usuario.isPresent()) {
            // Verificar senha usando SHA-256
            if (verificarSenha(senha, usuario.get().getSenha())) {
                return ResponseEntity.ok(usuario.get());
            }
        }
        
        Map<String, String> erro = new HashMap<>();
        erro.put("erro", "Email ou senha inválidos!");
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(erro);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> atualizarUsuario(@PathVariable Long id, 
                                                      @Valid @RequestBody Usuario usuarioAtualizado) {
        Usuario usuario = usuarioRepository.findById(id).orElse(null);
        if (usuario == null) {
            Map<String, String> erro = new HashMap<>();
            erro.put("erro", "Usuário não encontrado!");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(erro);
        }
        
        if (!usuario.getEmail().equals(usuarioAtualizado.getEmail())) {
            if (usuarioRepository.findByEmail(usuarioAtualizado.getEmail()).isPresent()) {
                Map<String, String> erro = new HashMap<>();
                erro.put("erro", "Email já cadastrado!");
                return ResponseEntity.status(HttpStatus.CONFLICT).body(erro);
            }
        }
        
        usuario.setNome(usuarioAtualizado.getNome());
        usuario.setEmail(usuarioAtualizado.getEmail());
        // Criptografar senha antes de atualizar
        usuario.setSenha(criptografarSenha(usuarioAtualizado.getSenha()));
        // Manter as flags existentes
        usuario.setProprietario(usuario.isProprietario());
        usuario.setInquilino(usuario.isInquilino());
        
        Usuario atualizado = usuarioRepository.save(usuario);
        return ResponseEntity.ok(atualizado);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletarUsuario(@PathVariable Long id) {
        Usuario usuario = usuarioRepository.findById(id).orElse(null);
        if (usuario == null) {
            Map<String, String> erro = new HashMap<>();
            erro.put("erro", "Usuário não encontrado!");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(erro);
        }
        usuarioRepository.delete(usuario);
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
