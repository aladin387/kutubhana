package com.kutubhana.demo.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import jakarta.persistence.Id;

@Entity
public class PdfFile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String filename;

    private String path;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "knjiga_id")
    @JsonBackReference
    private Knjige knjiga;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFilename() {
        return filename;
    }

    public void setFilename(String filename) {
        this.filename = filename;
    }

    public String getPath() {
        return path;
    }

    public void setPath(String path) {
        this.path = path;
    }

    public Knjige getKnjiga() {
        return knjiga;
    }

    public void setKnjiga(Knjige knjiga) {
        this.knjiga = knjiga;
    }
}
