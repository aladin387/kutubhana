package com.kutubhana.demo.controller;

import com.kutubhana.demo.DTO.KnjigeDTO;
import com.kutubhana.demo.mapper.KnjigeMapper;
import com.kutubhana.demo.model.Knjige;
import com.kutubhana.demo.model.PdfFile;
import com.kutubhana.demo.repository.KnjigeRepository;
import com.kutubhana.demo.repository.PdfFileRepository;
import org.springframework.core.io.Resource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;


import java.util.List;


@RestController
@RequestMapping("/api/knjige")
@CrossOrigin(origins = "*")
public class KnjigeController {

    @Autowired
    private KnjigeRepository knjigaRepo;

    @Autowired
    private PdfFileRepository pdfFileRepo;

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
    public ResponseEntity<?> obrisiKnjigu(@PathVariable Long id) {
        Knjige knjiga = knjigaRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Knjiga nije pronađena"));

        if (!knjiga.isDostupna()) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body("Knjiga je trenutno zadužena i ne može se obrisati.");
        }

        knjigaRepo.delete(knjiga);
        return ResponseEntity.ok().build();
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


    @PostMapping("/{id}/upload-pdf")
    public ResponseEntity<String> uploadPdfZaKnjigu(
            @PathVariable Long id,
            @RequestParam("file") MultipartFile file,
            @RequestParam("naziv") String naziv  // ⬅️ ovo je ključno
    ) {
        try {
            Optional<Knjige> knjigaOpt = knjigaRepo.findById(id);
            if (knjigaOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            if (file.isEmpty()) {
                return ResponseEntity.badRequest().body("Fajl je prazan.");
            }

            if (!"application/pdf".equals(file.getContentType())) {
                return ResponseEntity.badRequest().body("Samo PDF fajlovi su dozvoljeni.");
            }

            String uploadDir = System.getProperty("user.dir") + File.separator + "uploads" + File.separator;
            File dir = new File(uploadDir);
            if (!dir.exists()) {
                dir.mkdirs();
            }

            // Unikatno ime fajla da se ne prepiše
            String safeNaziv = naziv.replaceAll("[^a-zA-Z0-9-_\\. ]", "_");
            if (!safeNaziv.toLowerCase().endsWith(".pdf")) {
                safeNaziv += ".pdf";
            }

            File destination = new File(uploadDir + safeNaziv);
            if (destination.exists()) {
                String baseName = safeNaziv.replaceAll("\\.pdf$", "");
                safeNaziv = baseName + "_" + System.currentTimeMillis() + ".pdf";
                destination = new File(uploadDir + safeNaziv);
            }

            file.transferTo(destination);

            // Kreiraj novi PdfFile entitet i poveži sa knjigom
            PdfFile pdfFile = new PdfFile();
            pdfFile.setFilename(safeNaziv);
            pdfFile.setPath(destination.getAbsolutePath());
            pdfFile.setKnjiga(knjigaOpt.get());

            // Dodaj novi PdfFile u knjigu
            Knjige knjiga = knjigaOpt.get();
            knjiga.getPdfFiles().add(pdfFile);

            // Snimi knjigu sa novim PdfFile-om (cascade ALL će sačuvati i PdfFile)
            knjigaRepo.save(knjiga);

            return ResponseEntity.ok("PDF uspešno uploadovan za knjigu ID: " + id);
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Greška pri uploadu: " + e.getMessage());
        }
    }

    @GetMapping("/pdf-file/{pdfId}/download")
    public ResponseEntity<Resource> downloadPdfFile(@PathVariable Long pdfId) throws IOException {
        Optional<PdfFile> pdfFileOpt = pdfFileRepo.findById(pdfId);
        if (pdfFileOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        PdfFile pdfFile = pdfFileOpt.get();
        File file = new File(pdfFile.getPath());
        if (!file.exists()) {
            return ResponseEntity.notFound().build();
        }

        InputStreamResource resource = new InputStreamResource(new FileInputStream(file));

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment;filename=" + pdfFile.getFilename())
                .contentType(MediaType.APPLICATION_PDF)
                .contentLength(file.length())
                .body(resource);
    }


    @GetMapping("/{id}/pdf-files")
    public ResponseEntity<List<Map<String, Object>>> getPdfFilesZaKnjigu(@PathVariable Long id) {
        Optional<Knjige> knjigaOpt = knjigaRepo.findById(id);
        if (knjigaOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Knjige knjiga = knjigaOpt.get();

        // Mapiraj PdfFile entitete u JSON-friendly objekat sa id, fileName i downloadUrl
        List<Map<String, Object>> pdfFilesInfo = knjiga.getPdfFiles().stream()
                .filter(pdfFile -> new File(pdfFile.getPath()).exists()) // samo ako fajl postoji
                .map(pdfFile -> {
                    Map<String, Object> info = new HashMap<>();
                    info.put("id", pdfFile.getId());
                    info.put("fileName", pdfFile.getFilename());
                    info.put("downloadUrl", "/api/knjige/pdf-file/" + pdfFile.getId() + "/download");
                    return info;
                })
                .collect(Collectors.toList());

        return ResponseEntity.ok(pdfFilesInfo);
    }

    @DeleteMapping("/pdf-file/{pdfId}")
    public ResponseEntity<String> obrisiPdf(@PathVariable Long pdfId) {
        Optional<PdfFile> pdfFileOpt = pdfFileRepo.findById(pdfId);
        if (pdfFileOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        PdfFile pdfFile = pdfFileOpt.get();

        // 1. Obriši fajl sa diska
        File file = new File(pdfFile.getPath());
        if (file.exists() && !file.delete()) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Greška pri brisanju fajla sa diska.");
        }

        // 2. Obriši zapis iz baze
        pdfFileRepo.delete(pdfFile);

        return ResponseEntity.ok("PDF fajl uspešno obrisan.");
    }

    @PatchMapping("/pdf-file/{pdfId}")
    public ResponseEntity<String> izmijeniNazivPdfFajla(@PathVariable Long pdfId,
                                                        @RequestParam("noviNaziv") String noviNaziv) {
        Optional<PdfFile> pdfFileOpt = pdfFileRepo.findById(pdfId);
        if (pdfFileOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        PdfFile pdfFile = pdfFileOpt.get();
        File stariFajl = new File(pdfFile.getPath());

        // Sanitizuj naziv (dozvoli samo osnovne karaktere, bez / \ itd.)
        String safeNaziv = noviNaziv.replaceAll("[^a-zA-Z0-9-_\\. ]", "_");
        if (!safeNaziv.toLowerCase().endsWith(".pdf")) {
            safeNaziv += ".pdf";
        }

        File noviFajl = new File(stariFajl.getParent(), safeNaziv);

        // Ako fajl sa novim nazivom već postoji, dodaj timestamp
        if (noviFajl.exists()) {
            String baseName = safeNaziv.replaceAll("\\.pdf$", "");
            safeNaziv = baseName + "_" + System.currentTimeMillis() + ".pdf";
            noviFajl = new File(stariFajl.getParent(), safeNaziv);
        }

        boolean renameOK = stariFajl.renameTo(noviFajl);
        if (!renameOK) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Neuspješno preimenovanje fajla na disku.");
        }

        // Ažuriraj podatke u bazi
        pdfFile.setFilename(safeNaziv);
        pdfFile.setPath(noviFajl.getAbsolutePath());
        pdfFileRepo.save(pdfFile);

        return ResponseEntity.ok("Naziv PDF fajla je uspješno izmijenjen.");
    }


}
