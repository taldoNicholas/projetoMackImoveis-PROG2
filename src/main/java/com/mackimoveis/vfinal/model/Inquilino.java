package com.mackimoveis.vfinal.model;

import java.util.List;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;


@Entity
@DiscriminatorValue("INQUILINO")
public class Inquilino extends Usuario {

    @OneToMany(mappedBy = "inquilino")
    private List<Reserva> reservas;

    
    public Inquilino() {
        super();
    }

    
    public List<Reserva> getReservas() {
        return reservas;
    }

    public void setReservas(List<Reserva> novasReservas){
        this.reservas = novasReservas;
    }
}
