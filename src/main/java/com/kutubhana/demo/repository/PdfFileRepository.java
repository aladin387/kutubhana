package com.kutubhana.demo.repository;

import com.kutubhana.demo.model.PdfFile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PdfFileRepository extends JpaRepository<PdfFile, Long> {
    List<PdfFile> findByKnjigaId(Long knjigaId);
}
