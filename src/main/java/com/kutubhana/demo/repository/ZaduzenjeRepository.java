package com.kutubhana.demo.repository;

import com.kutubhana.demo.model.Knjige;
import com.kutubhana.demo.model.Korisnici;
import com.kutubhana.demo.model.Zaduzenje;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ZaduzenjeRepository extends JpaRepository<Zaduzenje, Long> {

    List<Zaduzenje> findByKorisniciUsername(String username); //može nekada valjati za prikaz historije

    Zaduzenje findByKnjigaAndDatumRazduzenjaIsNull(Knjige knjiga);

    List<Zaduzenje> findByDatumRazduzenjaIsNull();

    List<Zaduzenje> findByKorisniciAndDatumRazduzenjaIsNull(Korisnici korisnici);

    List<Zaduzenje> findByKorisniciId(Long id);
}
