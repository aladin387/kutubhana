package com.kutubhana.demo.service;

import com.kutubhana.demo.DTO.KorisniciPasswordDTO;
import com.kutubhana.demo.mapper.KorisniciMapper;
import com.kutubhana.demo.model.Korisnici;
import com.kutubhana.demo.repository.KorisniciRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class KorisniciService implements UserDetailsService {

    @Autowired
    private KorisniciRepository korisniciRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Korisnici korisnik = korisniciRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("Korisnik nije pronađen"));

        return User.builder()
                .username(korisnik.getUsername())
                .password(korisnik.getPassword())
                .roles(korisnik.getRole().name().replace("ROLE_", ""))
                .build();
    }

    public Korisnici createUser(KorisniciPasswordDTO dto) {
        Korisnici korisnik = KorisniciMapper.toEntity(dto);
        korisnik.setPassword(passwordEncoder.encode(dto.getPassword()));
        return korisniciRepository.save(korisnik);
    }

    public List<Korisnici> getAllUsers() {
        return korisniciRepository.findAll();
    }
}
