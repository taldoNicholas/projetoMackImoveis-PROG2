package com.mackimoveis.vfinal.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;


@Entity
@Table(name = "reservas")
public class Reserva {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "Data de check-in é obrigatória")
    private LocalDate dataCheckin;
    
    @NotNull(message = "Data de check-out é obrigatória")
    private LocalDate dataCheckout;
    
    private double custoTotal;

    @ManyToOne
    @JoinColumn(name = "propriedade_id")
    @JsonIgnore
    private Propriedade propriedade;

    @ManyToOne
    @JoinColumn(name = "inquilino_id")
    @JsonIgnore
    private Usuario inquilino;

    public Reserva(){}

    public Long getId() {
        return id;
    }

    public void setId(Long novoId) {
        this.id = novoId;
    }

    public LocalDate getDataCheckin() {
        return dataCheckin;
    }

    public void setDataCheckin(LocalDate novaDataCheckin) {
        this.dataCheckin = novaDataCheckin;
    }

    public LocalDate getDataCheckout() {
        return dataCheckout;
    }
    
    public void setDataCheckout(LocalDate novaDataCheckout) {
        this.dataCheckout = novaDataCheckout;
    }

    public double getCustoTotal() {
        return custoTotal;
    }
    
    public void setCustoTotal(double novoCustoTotal) {
        this.custoTotal = novoCustoTotal;
    }                           

    public Propriedade getPropriedade() {
        return propriedade;
    }

    public void setPropriedade(Propriedade novaPropriedade) {
        this.propriedade = novaPropriedade;
    }
    
    public PropriedadeInfo getPropriedadeInfo() {
        if (propriedade == null) return null;
        return new PropriedadeInfo(propriedade.getId(), propriedade.getTitulo(), propriedade.getLocalizacao());
    }
    
    public static class PropriedadeInfo {
        private Long id;
        private String titulo;
        private String localizacao;
        
        public PropriedadeInfo(Long id, String titulo, String localizacao) {
            this.id = id;
            this.titulo = titulo;
            this.localizacao = localizacao;
        }
        
        public Long getId() { return id; }
        public String getTitulo() { return titulo; }
        public String getLocalizacao() { return localizacao; }
    }

    public Usuario getInquilino() {
        return inquilino;
    }

    public void setInquilino(Usuario novoInquilino) {
        this.inquilino = novoInquilino;
    }
    
    public Long getInquilinoId() {
        return inquilino != null ? inquilino.getId() : null;
    }
}
