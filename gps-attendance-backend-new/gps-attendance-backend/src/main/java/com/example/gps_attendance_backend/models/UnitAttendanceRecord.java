//package com.example.gps_attendance_backend.models;
//
//import jakarta.persistence.*;
//import lombok.Data;
//
//import java.time.LocalDateTime;
//import java.util.UUID;
//
//@Data
//@Entity
//public class UnitAttendanceRecord {
//    @Id
//    @GeneratedValue(strategy = GenerationType.UUID)
//    private UUID attendanceId;
//
//    private Double latitude;
//    private Double longitude;
//    private LocalDateTime timestamp;
//
//    private String unitCode;
//    private String registrationNumber;
//
//    @ManyToOne
//    @JoinColumn(nullable = false)
//    private Users student;
//
//    @ManyToOne
//    @JoinColumn(nullable = false)
//    private Units unit;
//
//}
