package com.kutubhana.demo.repository;

import com.kutubhana.demo.model.Knjige;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface KnjigeRepository extends JpaRepository<Knjige, Long> {

    List<Knjige> findByNaslovContainingIgnoreCase(String naslov);
    List<Knjige> findByZanrContainingIgnoreCase(String zanr);
    List<Knjige> findByJezikContainingIgnoreCase(String jezik);
    List<Knjige> findByAutorContainingIgnoreCase(String autor);
}
