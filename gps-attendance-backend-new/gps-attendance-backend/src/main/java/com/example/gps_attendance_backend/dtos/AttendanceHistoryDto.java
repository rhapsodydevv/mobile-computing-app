package com.example.gps_attendance_backend.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@AllArgsConstructor
public class AttendanceHistoryDto {
    private UUID attendanceId;
    private String unitCode;
    private String unitName;
    private String classroomName;
    private LocalDateTime markedAt;
    private Boolean isInsideGeofence;
    private Double distanceFromClassroom;
}