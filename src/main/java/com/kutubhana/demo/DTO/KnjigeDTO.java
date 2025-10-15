package com.kutubhana.demo.DTO;

import jakarta.persistence.Lob;

public class KnjigeDTO {


    private Long id;
    private String naslov;
    private String autor;
    private String zanr;
    private String jezik;
    private String status; // Dostupna ili Zadužena: ime korisnika

    private String izdavac;
    private Integer godinaIzdavanja;
    private String isbn;
    private String zabiljeska;

    public KnjigeDTO() {
    }

    public KnjigeDTO(Long id, String naslov, String autor, String zanr, String jezik, String status, String izdavac, Integer godinaIzdavanja, String isbn, String zabiljeska) {
        this.id = id;
        this.naslov = naslov;
        this.autor = autor;
        this.zanr = zanr;
        this.jezik = jezik;
        this.status = status;
        this.izdavac = izdavac;
        this.godinaIzdavanja = godinaIzdavanja;
        this.isbn = isbn;
        this.zabiljeska = zabiljeska;
    }

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

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
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
