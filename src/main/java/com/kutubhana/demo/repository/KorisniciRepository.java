package com.kutubhana.demo.repository;

import com.kutubhana.demo.model.Korisnici;
import org.springframework.data.jpa.repository.JpaRepository;


import java.util.Optional;


public interface KorisniciRepository extends JpaRepository<Korisnici, Long> {

    Optional<Korisnici> findByUsername(String username);

}





