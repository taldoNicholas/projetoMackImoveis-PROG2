package com.mackimoveis.vfinal.repository;

import com.mackimoveis.vfinal.model.Inquilino;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface InquilinoRepository extends JpaRepository<Inquilino, Long> {
    Optional<Inquilino> findByEmail(String email);
}
