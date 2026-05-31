package com.example.gps_attendance_backend.models;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Entity
public class Attendance {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID attendanceId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private Users student;

    private String studentRegistrationNumber;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "class_session_id", nullable = false)
    private ClassSession classSession;

    private String unitCode;

    private String classroomName;

    private LocalDateTime markedAt;

    private Double studentLatitude;
    private Double studentLongitude;

    private Double distanceFromClassroom;
    private Boolean isInsideGeofence;


}
