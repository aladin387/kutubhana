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

    private String email;
    private String phone;
    private String address;

    private String password;

    @Enumerated(EnumType.STRING)
    private UsersRoles role;


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

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String adress) {
        this.address = adress;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public UsersRoles getRole() {
        return role;
    }

    public void setRole(UsersRoles role) {
        this.role = role;
    }
}