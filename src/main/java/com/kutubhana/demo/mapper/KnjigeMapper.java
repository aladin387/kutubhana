package com.kutubhana.demo.mapper;

import com.kutubhana.demo.DTO.KnjigeDTO;
import com.kutubhana.demo.model.Knjige;
import com.kutubhana.demo.model.Zaduzenje;

public class KnjigeMapper {


    public static KnjigeDTO toDTO(Knjige knjiga) {
        String status = "Dostupna";

        if (knjiga.getZaduzenja() != null) {
            for (Zaduzenje zaduzenje : knjiga.getZaduzenja()) {
                if (zaduzenje.getDatumRazduzenja() == null) {
                    String korisnikIme = zaduzenje.getKorisnici() != null ? zaduzenje.getKorisnici().getUsername() : "Nepoznat korisnik";
                    status = "Zadužena: " + korisnikIme;
                    break;
                }
            }
        }

        return new KnjigeDTO(
                knjiga.getId(),
                knjiga.getNaslov(),
                knjiga.getAutor(),
                knjiga.getZanr(),
                knjiga.getJezik(),
                status,
                knjiga.getIzdavac(),
                knjiga.getGodinaIzdavanja(),
                knjiga.getIsbn(),
                knjiga.getZabiljeska()
        );
    }
}
