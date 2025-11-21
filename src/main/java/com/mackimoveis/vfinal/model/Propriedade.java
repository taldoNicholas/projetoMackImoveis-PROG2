package com.mackimoveis.vfinal.model;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.Transient;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

@Entity
@Table(name = "propriedades")
public class Propriedade {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Título é obrigatório")
    @Size(min = 3, max = 200, message = "Título deve ter entre 3 e 200 caracteres")
    private String titulo;
    
    @NotBlank(message = "Descrição é obrigatória")
    @Size(min = 10, max = 2000, message = "Descrição deve ter entre 10 e 2000 caracteres")
    private String descricao;
    
    @NotBlank(message = "Localização é obrigatória")
    @Size(max = 200, message = "Localização deve ter no máximo 200 caracteres")
    private String localizacao;
    
    @NotNull(message = "Capacidade é obrigatória")
    @Min(value = 1, message = "Capacidade deve ser no mínimo 1")
    private int capacidade;
    
    @NotNull(message = "Preço por noite é obrigatório")
    @Positive(message = "Preço por noite deve ser positivo")
    private double precoPorNoite;
    
    private boolean disponivel;
    
    @ElementCollection
    @CollectionTable(name = "propriedade_fotos", joinColumns = @JoinColumn(name = "propriedade_id"))
    @Column(name = "foto_url")
    private List<String> fotos = new ArrayList<>();
    
    @ManyToOne
    @JoinColumn(name = "proprietario_id")
    @JsonIgnore
    private Usuario proprietario;


    public Propriedade() {}



    public Long getId() {
        return id;
    }

    public void setId(Long novoId) {
        this.id = novoId;
    }

    public String getTitulo() {
        return titulo;
    }

    public void setTitulo(String novoTitulo) {
        this.titulo = novoTitulo;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String novaDescricao) {
        this.descricao = novaDescricao;
    }

    public String getLocalizacao() {
        return localizacao;
    }
    
    public void setLocalizacao(String novaLocalizacao) {
        this.localizacao = novaLocalizacao;
    }

    public int getCapacidade() {
        return capacidade;
    }
    
    public void setCapacidade(int novaCapacidade) {
        this.capacidade = novaCapacidade;
    }

    public double getPrecoPorNoite() {
        return precoPorNoite;
    }
    
    public void setPrecoPorNoite(double novoPrecoPorNoite) {
        this.precoPorNoite = novoPrecoPorNoite;
    }

    public boolean isDisponivel() {
        return disponivel;
    }
    
    public void setDisponivel(boolean novoDisponivel) {
        this.disponivel = novoDisponivel;
    }

    public Usuario getProprietario() {
        return proprietario;
    }
    
    public void setProprietario(Usuario novoProprietario) {
        this.proprietario = novoProprietario;
    }
    
    public Long getProprietarioId() {
        return proprietario != null ? proprietario.getId() : null;
    }
    
    @Transient
    private ReservaInfo reservaAtiva;
    
    public ReservaInfo getReservaAtiva() {
        return reservaAtiva;
    }
    
    public void setReservaAtiva(ReservaInfo reservaAtiva) {
        this.reservaAtiva = reservaAtiva;
    }
    
    public static class ReservaInfo {
        private Long id;
        private String inquilinoNome;
        private String inquilinoEmail;
        private String dataCheckin;
        private String dataCheckout;
        private long dias;
        
        public ReservaInfo(Long id, String inquilinoNome, String inquilinoEmail, 
                          String dataCheckin, String dataCheckout, long dias) {
            this.id = id;
            this.inquilinoNome = inquilinoNome;
            this.inquilinoEmail = inquilinoEmail;
            this.dataCheckin = dataCheckin;
            this.dataCheckout = dataCheckout;
            this.dias = dias;
        }
        
        public Long getId() { return id; }
        public String getInquilinoNome() { return inquilinoNome; }
        public String getInquilinoEmail() { return inquilinoEmail; }
        public String getDataCheckin() { return dataCheckin; }
        public String getDataCheckout() { return dataCheckout; }
        public long getDias() { return dias; }
    }

    public List<String> getFotos() {
        return fotos;
    }

    public void setFotos(List<String> novasFotos) {
        this.fotos = novasFotos;
    }

    public void adicionarFoto(String fotoUrl) {
        if (fotos == null) {
            fotos = new ArrayList<>();
        }
        fotos.add(fotoUrl);
    }
}       
