package com.kutubhana.demo.repository;

import com.kutubhana.demo.model.Knjige;
import com.kutubhana.demo.model.Zaduzenje;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ZaduzenjeRepository extends JpaRepository<Zaduzenje, Long> {

    List<Zaduzenje> findByKorisniciUsername(String username);
    Zaduzenje findByKnjigaAndDatumRazduzenjaIsNull(Knjige knjiga);


    List<Zaduzenje> findByDatumRazduzenjaIsNull();

}
