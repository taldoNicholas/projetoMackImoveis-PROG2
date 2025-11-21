package com.mackimoveis.vfinal.repository;

import com.mackimoveis.vfinal.model.Propriedade;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PropriedadeRepository extends JpaRepository<Propriedade, Long> {
    List<Propriedade> findByProprietario_Id(Long proprietarioId);

    List<Propriedade> findByDisponivel(boolean disponivel);
}
