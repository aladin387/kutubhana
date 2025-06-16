package com.kutubhana.demo.model;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;

import java.util.ArrayList;
import java.util.List;

@Entity
public class Korisnici {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Autor je obavezan")
    private String username;


    @OneToMany(mappedBy = "korisnici", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference(value = "korisnik-zaduzenje")
    private List<Zaduzenje> zaduzenja = new ArrayList<>();


    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }


    public List<Zaduzenje> getZaduzenja() {

        return zaduzenja;
    }

    public void setZaduzenja(List<Zaduzenje> zaduzenja) {
        this.zaduzenja = zaduzenja;
    }
}