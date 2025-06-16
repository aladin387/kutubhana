package com.kutubhana.demo.service;

import com.kutubhana.demo.model.Knjige;
import com.kutubhana.demo.model.Korisnici;
import com.kutubhana.demo.model.Zaduzenje;
import com.kutubhana.demo.repository.KnjigeRepository;
import com.kutubhana.demo.repository.KorisniciRepository;
import com.kutubhana.demo.repository.ZaduzenjeRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
public class ZaduzenjeService {

    @Autowired
    private ZaduzenjeRepository zaduzenjeRepository;

    @Autowired
    private KnjigeRepository knjigeRepository;

    @Autowired
    private KorisniciRepository korisniciRepository;

    public Zaduzenje zaduziKnjigu(Long knjigaId, Long korisnikId, LocalDate datumZaduzenja) {
        Knjige knjiga = knjigeRepository.findById(knjigaId)
                .orElseThrow(() -> new EntityNotFoundException("Knjiga nije pronađena"));
        Korisnici korisnik = korisniciRepository.findById(korisnikId)
                .orElseThrow(() -> new EntityNotFoundException("Korisnik nije pronađen"));

        Zaduzenje zaduzenje = new Zaduzenje();
        zaduzenje.setKnjiga(knjiga);
        zaduzenje.setKorisnici(korisnik);
        zaduzenje.setDatumZaduzenja(datumZaduzenja);

        return zaduzenjeRepository.save(zaduzenje);
    }
}
