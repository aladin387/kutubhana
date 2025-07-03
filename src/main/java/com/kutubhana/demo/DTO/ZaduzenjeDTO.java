package com.kutubhana.demo.DTO;

import java.time.LocalDate;

public class ZaduzenjeDTO {


    private String naslov;
    private LocalDate datumZaduzenja;
    private LocalDate datumRazduzenja;


    public String getNaslov() {
        return naslov;
    }

    public void setNaslov(String naslov) {
        this.naslov = naslov;
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
