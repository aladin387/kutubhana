package com.kutubhana.demo.DTO;

import com.kutubhana.demo.model.UsersRoles;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public class KorisniciDTO {

        private Long id;

        @NotBlank(message = "Korisničko ime je obavezno")
        private String username;

        @Email(message = "Email nije validan")
        private String email;

        private String phone;
        private String address;
        private UsersRoles role;

    public KorisniciDTO() {

    }

    public KorisniciDTO(Long id, String username, String email, String phone, String address, UsersRoles role) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.phone = phone;
        this.address = address;
        this.role = role;
    }

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

    public void setAddress(String address) {
        this.address = address;
    }

    public UsersRoles getRole() {
        return role;
    }

    public void setRole(UsersRoles role) {
        this.role = role;
    }
}
