package com.kutubhana.demo.config;

import com.kutubhana.demo.model.Korisnici;
import com.kutubhana.demo.model.UsersRoles;
import com.kutubhana.demo.repository.KorisniciRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer {

    @Bean
    public CommandLineRunner initAdminUser(KorisniciRepository korisniciRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            String adminUsername = "admin";

            // Provjera da li admin već postoji
            if (korisniciRepository.findByUsername(adminUsername).isEmpty()) {
                Korisnici admin = new Korisnici();
                admin.setUsername(adminUsername);
                admin.setPassword(passwordEncoder.encode("admin123")); // obavezno enkriptovana lozinka!
                admin.setEmail("admin@biblioteka.com");
                admin.setPhone("123456789");
                admin.setAddress("Glavna 1");
                admin.setRole(UsersRoles.ROLE_ADMIN);

                korisniciRepository.save(admin);
                System.out.println("🟢 ADMIN korisnik kreiran: admin / admin123");
            } else {
                System.out.println("ℹ️ ADMIN korisnik već postoji.");
            }
        };
    }
}
