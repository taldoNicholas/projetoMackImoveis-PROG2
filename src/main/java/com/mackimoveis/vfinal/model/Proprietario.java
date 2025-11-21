package com.mackimoveis.vfinal.model;

import java.util.List;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;

@Entity
@DiscriminatorValue("PROPRIETARIO")
public class Proprietario extends Usuario {

    @OneToMany(mappedBy = "proprietario")
    private List<Propriedade> propriedades;

    public Proprietario() {
        super();
    }

    public List<Propriedade> getPropriedades(){
        return propriedades;
    }

    public void setPropriedades(List<Propriedade> novasPropriedades){
        this.propriedades = novasPropriedades;
    }
}
