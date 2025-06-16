package com.kutubhana.demo.controller;

import com.kutubhana.demo.DTO.KnjigeDTO;
import com.kutubhana.demo.mapper.KnjigeMapper;
import com.kutubhana.demo.model.Knjige;
import com.kutubhana.demo.repository.KnjigeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.stream.Collectors;


import java.util.List;


@RestController
@RequestMapping("/api/knjige")
@CrossOrigin(origins = "*")
public class KnjigeController {

    @Autowired
    private KnjigeRepository knjigaRepo;

    @GetMapping
    public List<KnjigeDTO> sveKnjige() {

        return knjigaRepo.findAll().stream()
                .map(KnjigeMapper::toDTO)
                .collect(Collectors.toList());
    }

    @PostMapping
    public Knjige dodajKnjigu(@RequestBody Knjige knjiga) {
        return knjigaRepo.save(knjiga);
    }

    @DeleteMapping("/{id}")
    public void obrisiKnjigu(@PathVariable Long id) {
        knjigaRepo.deleteById(id);
    }

    @PutMapping("/{id}")
    public Knjige izmijeniKnjigu(@PathVariable Long id, @RequestBody Knjige nova) {
        return knjigaRepo.findById(id).map(knjiga -> {
            knjiga.setNaslov(nova.getNaslov());
            knjiga.setAutor(nova.getAutor());
            knjiga.setZanr(nova.getZanr());
            knjiga.setJezik(nova.getJezik());
            return knjigaRepo.save(knjiga);
        }).orElseThrow(() -> new RuntimeException("Knjiga nije pronađena"));
    }

    @GetMapping("/pretraga")
    public List<Knjige> pretraga(@RequestParam(required = false) String naslov,
                                 @RequestParam(required = false) String autor,
                                 @RequestParam(required = false) String zanr,
                                 @RequestParam(required = false) String jezik) {
        if (naslov != null) return knjigaRepo.findByNaslovContainingIgnoreCase(naslov);
        if (autor != null) return knjigaRepo.findByAutorContainingIgnoreCase(autor);
        if (zanr != null) return knjigaRepo.findByZanrContainingIgnoreCase(zanr);
        if (jezik != null) return knjigaRepo.findByJezikContainingIgnoreCase(jezik);
        return List.of();
    }




}
