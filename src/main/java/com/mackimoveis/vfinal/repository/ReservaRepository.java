package com.mackimoveis.vfinal.repository;

import com.mackimoveis.vfinal.model.Reserva;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ReservaRepository extends JpaRepository<Reserva, Long> {
    
    List<Reserva> findByInquilino_Id(Long inquilinoId);
    
    List<Reserva> findByPropriedade_Id(Long propriedadeId);
}
