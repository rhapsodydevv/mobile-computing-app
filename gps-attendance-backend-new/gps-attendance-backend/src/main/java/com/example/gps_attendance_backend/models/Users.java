package com.example.gps_attendance_backend.models;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Data;

import java.util.Set;
import java.util.UUID;

@Data
@Entity
public class Users {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID userId;

    private String firstName;
    private String lastName;

    @Column(unique = true)
    private String email;
    private String password;

    @Column(unique = true)
    private String registrationNumber;

    @ManyToOne
    @JsonManagedReference
    private Course course;

    private String CourseCode;
    private int year;
    private int semester;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "user_roles", joinColumns = @JoinColumn(name = "user_email"))
    @Enumerated(EnumType.STRING) // Stores "ADMIN" instead of 1
    @Column(name = "role")
    private Set<UserRole> roles;

}
