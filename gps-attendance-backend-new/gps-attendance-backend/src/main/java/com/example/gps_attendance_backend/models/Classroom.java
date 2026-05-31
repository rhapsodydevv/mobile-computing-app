package com.example.gps_attendance_backend.models;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Data;

import java.util.UUID;

@Data
@Entity
public class Classroom {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID classroomId;

    private String roomName;

    private Double latitude;
    private Double longitude;
    private Double radius = 50.0;
}
