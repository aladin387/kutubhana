package com.kutubhana.demo.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;

import java.util.ArrayList;
import java.util.List;

@Entity
public class Knjige {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Naslov je obavezan")
    private String naslov;

    @NotBlank(message = "Autor je obavezan")
    private String autor;

    private String zanr;

    private String jezik;

    private boolean dostupna = true;


    @OneToMany(mappedBy = "knjiga", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<Zaduzenje> zaduzenja = new ArrayList<>();


    @OneToMany(mappedBy = "knjiga", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<PdfFile> pdfFiles = new ArrayList<>();

    private String izdavac;
    private Integer godinaIzdavanja;
    private String isbn;

    @Lob
    private String zabiljeska;



    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNaslov() {
        return naslov;
    }

    public void setNaslov(String naslov) {
        this.naslov = naslov;
    }

    public String getAutor() {
        return autor;
    }

    public void setAutor(String autor) {
        this.autor = autor;
    }

    public String getZanr() {
        return zanr;
    }

    public void setZanr(String zanr) {
        this.zanr = zanr;
    }

    public String getJezik() {
        return jezik;
    }

    public void setJezik(String jezik) {
        this.jezik = jezik;
    }

    public boolean isDostupna() {
        return dostupna;
    }

    public void setDostupna(boolean dostupna) {
        this.dostupna = dostupna;
    }

    public List<Zaduzenje> getZaduzenja() {
        return zaduzenja;
    }

    public void setZaduzenja(List<Zaduzenje> zaduzenja) {
        this.zaduzenja = zaduzenja;
    }

    public List<PdfFile> getPdfFiles() {
        return pdfFiles;
    }

    public void setPdfFiles(List<PdfFile> pdfFiles) {
        this.pdfFiles = pdfFiles;
    }

    public String getIzdavac() {
        return izdavac;
    }

    public void setIzdavac(String izdavac) {
        this.izdavac = izdavac;
    }

    public Integer getGodinaIzdavanja() {
        return godinaIzdavanja;
    }

    public void setGodinaIzdavanja(Integer godinaIzdavanja) {
        this.godinaIzdavanja = godinaIzdavanja;
    }

    public String getIsbn() {
        return isbn;
    }

    public void setIsbn(String isbn) {
        this.isbn = isbn;
    }

    public String getZabiljeska() {
        return zabiljeska;
    }

    public void setZabiljeska(String zabiljeska) {
        this.zabiljeska = zabiljeska;
    }
}