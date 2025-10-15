package com.kutubhana.demo.mapper;

import com.kutubhana.demo.DTO.KorisniciDTO;
import com.kutubhana.demo.DTO.KorisniciPasswordDTO;
import com.kutubhana.demo.model.Korisnici;

public class KorisniciMapper {


        public static KorisniciDTO toDTO(Korisnici korisnik) {
            if (korisnik == null) return null;

            return new KorisniciDTO(
                    korisnik.getId(),
                    korisnik.getUsername(),
                    korisnik.getEmail(),
                    korisnik.getPhone(),
                    korisnik.getAddress(),
                    korisnik.getRole()
            );
        }

        public static Korisnici toEntity(KorisniciDTO dto) {
            if (dto == null) return null;

            Korisnici korisnik = new Korisnici();
            korisnik.setId(dto.getId());
            korisnik.setUsername(dto.getUsername());
            korisnik.setEmail(dto.getEmail());
            korisnik.setPhone(dto.getPhone());
            korisnik.setAddress(dto.getAddress());
            korisnik.setRole(dto.getRole());

            return korisnik;
        }

    public static Korisnici toEntity(KorisniciPasswordDTO dto) {
        if (dto == null) return null;

        Korisnici korisnik = new Korisnici();
        korisnik.setUsername(dto.getUsername());
        korisnik.setPassword(dto.getPassword());  // hashiranje lozinke ide u kontroleru/service, ovdje samo setujemo

        return korisnik;
    }

}


