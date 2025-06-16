package com.kutubhana.demo.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.kutubhana.demo.model.Korisnici;
import com.kutubhana.demo.repository.KorisniciRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/korisnici")
@CrossOrigin(origins = "*")
public class KorisniciController {

    @Autowired
    private KorisniciRepository korisniciRepo;

    @GetMapping
    public List<Korisnici> getAll() {
        return korisniciRepo.findAll();
    }

    @PostMapping
    public Korisnici create(@RequestBody Korisnici korisnici) {
        return korisniciRepo.save(korisnici);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Korisnici> update(@PathVariable Long id, @RequestBody Korisnici korisniciDetalji) {
        Korisnici korisnici = korisniciRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Korisnik nije pronađen"));

        korisnici.setUsername(korisniciDetalji.getUsername());
        Korisnici azuriran = korisniciRepo.save(korisnici);
        return ResponseEntity.ok(azuriran);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        Korisnici korisnici = korisniciRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Korisnik nije pronađen"));
        korisniciRepo.delete(korisnici);
        return ResponseEntity.noContent().build();
    }
}