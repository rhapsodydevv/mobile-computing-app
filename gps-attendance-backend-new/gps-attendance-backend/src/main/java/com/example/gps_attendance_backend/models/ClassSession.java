package com.example.gps_attendance_backend.models;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Entity
public class ClassSession {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID classSessionId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "unit_id", nullable = false)
    private Units unit;

    private String unitCode;

//    @ManyToOne(fetch = FetchType.LAZY)
//    @JoinColumn(name = "lecturer_id", nullable = false)
//    private Users lecturer;
//
//    private String lecturerName;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "classroom_id", nullable = false)
    private Classroom classroom;

    private String classroomName;

    @Column(nullable = false)
    private LocalDateTime startTime;

    @Column(nullable = false)
    private LocalDateTime endTime;

    @Column(nullable = false)
    private Boolean isActive;
}
