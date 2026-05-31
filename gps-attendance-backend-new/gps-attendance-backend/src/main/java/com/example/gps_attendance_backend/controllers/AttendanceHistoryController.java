package com.example.gps_attendance_backend.controllers;

import com.example.gps_attendance_backend.models.ApiResponse;
import com.example.gps_attendance_backend.services.AttendanceHistoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/attendance-history")
public class AttendanceHistoryController {

    @Autowired
    private AttendanceHistoryService historyService;

    @GetMapping
    public ResponseEntity<ApiResponse> getStudentHistoryLog(@RequestParam String registrationNumber) {
        try {
            return ResponseEntity.ok(
                    new ApiResponse<>(1, "Attendance history logs retrieved successfully",
                            historyService.fetchStudentAttendanceLogs(registrationNumber))
            );
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                    new ApiResponse<>(0, "Failed to compile attendance trace tracking logs: " + e.getMessage(), null)
            );
        }
    }
}