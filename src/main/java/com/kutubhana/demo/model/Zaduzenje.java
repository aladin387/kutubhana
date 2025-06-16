package com.kutubhana.demo.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;

import java.time.LocalDate;

@Entity
public class Zaduzenje {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JsonBackReference
    private Knjige knjiga;

    @ManyToOne
    @JoinColumn(name = "korisnik_id")
    @JsonBackReference(value = "korisnik-zaduzenje")
    private Korisnici korisnici;

    private LocalDate datumZaduzenja;
    private LocalDate datumRazduzenja;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Knjige getKnjiga() {
        return knjiga;
    }

    public void setKnjiga(Knjige knjiga) {
        this.knjiga = knjiga;
    }

    public Korisnici getKorisnici() {
        return korisnici;
    }

    public void setKorisnici(Korisnici korisnici) {
        this.korisnici = korisnici;
    }

    public LocalDate getDatumZaduzenja() {
        return datumZaduzenja;
    }

    public void setDatumZaduzenja(LocalDate datumZaduzenja) {
        this.datumZaduzenja = datumZaduzenja;
    }

    public LocalDate getDatumRazduzenja() {
        return datumRazduzenja;
    }

    public void setDatumRazduzenja(LocalDate datumRazduzenja) {
        this.datumRazduzenja = datumRazduzenja;
    }
}