package com.example.gps_attendance_backend.models;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Entity
public class Units {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID unitId;

    private String unitCode;
    private String unitName;

    @ManyToOne
    @JoinColumn(name = "course-code", nullable = false)
    private Course course;

    private String courseCode;
    private int year;
    private int semester;

}
