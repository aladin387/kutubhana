package com.kutubhana.demo.controller;

import com.kutubhana.demo.DTO.KorisniciDTO;
import com.kutubhana.demo.DTO.KorisniciPasswordDTO;
import com.kutubhana.demo.mapper.KorisniciMapper;
import com.kutubhana.demo.service.KorisniciService;
import jakarta.validation.Valid;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.kutubhana.demo.model.Korisnici;
import com.kutubhana.demo.repository.KorisniciRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/korisnici")
@CrossOrigin(origins = "*")
public class KorisniciController {

    @Autowired
    private KorisniciRepository korisniciRepo;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private KorisniciService korisniciService;


    @GetMapping
    public List<KorisniciDTO> getAll() {
        return korisniciService.getAllUsers()
                .stream()
                .map(KorisniciMapper::toDTO)
                .collect(Collectors.toList());
    }

    @GetMapping("/me")
    public ResponseEntity<KorisniciDTO> getCurrentUser(Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(401).build(); // korisnik nije ulogovan
        }

        // Pronađi korisnika po username-u iz Principal objekta
        Korisnici korisnik = korisniciRepo.findByUsername(principal.getName())
                .orElseThrow(() -> new RuntimeException("Korisnik nije pronađen"));

        return ResponseEntity.ok(KorisniciMapper.toDTO(korisnik));
    }


    @PostMapping
    public ResponseEntity<KorisniciDTO> create(@Valid @RequestBody KorisniciPasswordDTO dto) {
        Korisnici saved = korisniciService.createUser(dto);
        return ResponseEntity.ok(KorisniciMapper.toDTO(saved));
    }

    @PutMapping("/{id}")
    public ResponseEntity<KorisniciDTO> update(@PathVariable Long id, @RequestBody KorisniciDTO dto) {
        Korisnici korisnik = korisniciRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Korisnik nije pronađen"));

        korisnik.setUsername(dto.getUsername());
        korisnik.setEmail(dto.getEmail());
        korisnik.setPhone(dto.getPhone());
        korisnik.setAddress(dto.getAddress());
        korisnik.setRole(dto.getRole());

        Korisnici updated = korisniciRepo.save(korisnik);
        return ResponseEntity.ok(KorisniciMapper.toDTO(updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        Korisnici korisnik = korisniciRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Korisnik nije pronađen"));
        korisniciRepo.delete(korisnik);
        return ResponseEntity.noContent().build();
    }
}