package com.mackimoveis.vfinal.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;


@Entity
@Table(name = "usuarios")
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Nome é obrigatório")
    @Size(min = 2, max = 100, message = "Nome deve ter entre 2 e 100 caracteres")
    @Column(nullable = false)
    private String nome;

    @NotBlank(message = "Email é obrigatório")
    @Email(message = "Email deve ser válido")
    @Column(nullable = false, unique = true)
    private String email;

    @NotBlank(message = "Senha é obrigatória")
    @Size(min = 6, message = "Senha deve ter no mínimo 6 caracteres")
    @Column(nullable = false)
    private String senha;
    
    @Column(nullable = false)
    private boolean isProprietario = false;
    
    @Column(nullable = false)
    private boolean isInquilino = false;

    public Usuario(){}

    public Usuario(String nome, String email, String senha){
        this.nome = nome;
        this.email = email;
        this.senha = senha;
        this.isProprietario = false;
        this.isInquilino = false;
    }

    public Long getId(){
        return id;
    }

    public void setId(Long novoId){
        this.id = novoId;
    }

    public String getNome(){
        return nome;
    }

    public void setNome(String novoNome){
        this.nome = novoNome;
    }

    public String getEmail(){
        return email;
    }

    public void setEmail(String novoEmail){
        this.email = novoEmail;
    }

    public String getSenha(){
        return senha;
    }

    public void setSenha(String novaSenha){
        this.senha = novaSenha;
    }
    
    public boolean isProprietario() {
        return isProprietario;
    }
    
    public void setProprietario(boolean isProprietario) {
        this.isProprietario = isProprietario;
    }
    
    public boolean isInquilino() {
        return isInquilino;
    }
    
    public void setInquilino(boolean isInquilino) {
        this.isInquilino = isInquilino;
    }
    
    public String getTipoUsuario() {
        if (isProprietario && isInquilino) {
            return "AMBOS";
        } else if (isProprietario) {
            return "PROPRIETARIO";
        } else if (isInquilino) {
            return "INQUILINO";
        }
        return "NENHUM";
    }
}
