package com.kutubhana.demo.controller;

import com.kutubhana.demo.DTO.ZaduzenjeDTO;
import com.kutubhana.demo.model.Knjige;
import com.kutubhana.demo.model.Korisnici;
import com.kutubhana.demo.model.Zaduzenje;
import com.kutubhana.demo.repository.KnjigeRepository;
import com.kutubhana.demo.repository.KorisniciRepository;
import com.kutubhana.demo.repository.ZaduzenjeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/zaduzenja")
@CrossOrigin(origins = "*")
public class ZaduzenjeController {

    @Autowired
    private ZaduzenjeRepository zaduzenjeRepo;

    @Autowired
    private KnjigeRepository knjigaRepo;

    @Autowired
    private KorisniciRepository korisniciRepo;


    @PostMapping("/zaduzi")
    public ResponseEntity<String> zaduzi(@RequestParam Long knjigaId, @RequestParam String username) {
        Knjige knjiga = knjigaRepo.findById(knjigaId)
                .orElseThrow(() -> new RuntimeException("Knjiga nije pronađena"));

        if (!knjiga.isDostupna()) return ResponseEntity.badRequest().body("Knjiga nije dostupna");


        Optional<Korisnici> korisnikOpt = korisniciRepo.findByUsername(username);
        if (korisnikOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Korisnik nije pronađen");
        }

        Korisnici k = korisnikOpt.get();

        knjiga.setDostupna(false);
        knjigaRepo.save(knjiga);

        Zaduzenje z = new Zaduzenje();
        z.setKnjiga(knjiga);
        z.setKorisnici(k);
        z.setDatumZaduzenja(LocalDate.now());

        zaduzenjeRepo.save(z);

        return ResponseEntity.ok("Zaduživanje uspješno");
    }


    @PostMapping("/razduzi")
    public ResponseEntity<?> razduzi(@RequestParam Long knjigaId) {
        Knjige knjiga = knjigaRepo.findById(knjigaId)
                .orElseThrow(() -> new RuntimeException("Knjiga nije pronađena"));

        Zaduzenje aktivno = zaduzenjeRepo.findByKnjigaAndDatumRazduzenjaIsNull(knjiga);
        if (aktivno == null) {
            return ResponseEntity.badRequest().body("Knjiga nije trenutno zadužena");
        }

        aktivno.setDatumRazduzenja(LocalDate.now());
        zaduzenjeRepo.save(aktivno);

        knjiga.setDostupna(true);
        knjigaRepo.save(knjiga);


        return ResponseEntity.ok("Knjiga razdužena");
    }


    @GetMapping("/aktivni-korisnici")
    public List<Korisnici> getAktivniKorisnici() {
        return zaduzenjeRepo.findByDatumRazduzenjaIsNull()
                .stream()
                .map(Zaduzenje::getKorisnici)
                .distinct()
                .collect(Collectors.toList());
    }

    @GetMapping("/korisnik/{id}")
    public ResponseEntity<List<ZaduzenjeDTO>> getAktivnaZaduzenjaZaKorisnika(@PathVariable Long id) {
        Optional<Korisnici> korisnikOpt = korisniciRepo.findById(id);
        if (korisnikOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        List<Zaduzenje> aktivnaZaduzenja = zaduzenjeRepo.findByKorisniciAndDatumRazduzenjaIsNull(korisnikOpt.get());

        List<ZaduzenjeDTO> rezultat = aktivnaZaduzenja.stream().map(z -> {
            ZaduzenjeDTO dto = new ZaduzenjeDTO();
            dto.setNaslov(z.getKnjiga().getNaslov());
            dto.setDatumZaduzenja(z.getDatumZaduzenja());
            dto.setDatumRazduzenja(z.getDatumRazduzenja());
            return dto;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(rezultat);
    }


    @GetMapping("/korisnik/{id}/historija")
    public ResponseEntity<List<ZaduzenjeDTO>> getHistorijaZaduzenja(@PathVariable Long id) {
        Optional<Korisnici> korisnikOpt = korisniciRepo.findById(id);
        if (korisnikOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        // ✅ Bitna izmjena: koristimo ID umjesto objekta Korisnici
        List<Zaduzenje> historija = zaduzenjeRepo.findByKorisniciId(id);

        List<ZaduzenjeDTO> rezultat = historija.stream().map(z -> {
            ZaduzenjeDTO dto = new ZaduzenjeDTO();
            dto.setNaslov(z.getKnjiga().getNaslov());
            dto.setDatumZaduzenja(z.getDatumZaduzenja());
            dto.setDatumRazduzenja(z.getDatumRazduzenja());
            return dto;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(rezultat);
    }

}
