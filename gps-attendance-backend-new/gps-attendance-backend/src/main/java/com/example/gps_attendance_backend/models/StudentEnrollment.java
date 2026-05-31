package com.example.gps_attendance_backend.models;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
@Entity
public class StudentEnrollment {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID enrollmentId;

    @ManyToOne
    @JoinColumn(name = "student_id", nullable = false)
    private Users student;

    private String studentRegistrationNumber;

    @ManyToOne
    @JoinColumn(name = "unit_id", nullable = false)
    private Units unit;

    private String unitCode;

    private LocalDateTime enrolledAt = LocalDateTime.now();




}
