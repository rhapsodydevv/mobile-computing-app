package com.example.gps_attendance_backend.controllers;

import com.example.gps_attendance_backend.models.ApiResponse;
import com.example.gps_attendance_backend.services.AttendanceAnalyticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/analytics")
public class AttendanceAnalyticsController {

    @Autowired
    private AttendanceAnalyticsService analyticsService;

    // Get overall system analytics (Across all Units)
    @GetMapping("/overall")
    public ResponseEntity<ApiResponse> getOverallAnalytics() {
        return ResponseEntity.ok(
                new ApiResponse<>(1, "Overall analytics fetched successfully", analyticsService.getOverallSystemAnalytics())
        );
    }

    // Get specific unit summary analytics
    @GetMapping("/unit/{unitCode}")
    public ResponseEntity<ApiResponse> getUnitAnalytics(@PathVariable String unitCode) {
        return ResponseEntity.ok(
                new ApiResponse<>(1, "Unit analytics fetched successfully", analyticsService.getUnitAnalytics(unitCode))
        );
    }

    // Get an individual student's comprehensive attendance report card
    @GetMapping("/student")
    public ResponseEntity<ApiResponse> getStudentAnalytics(@RequestParam String registrationNumber) {
        try {
            return ResponseEntity.ok(
                    new ApiResponse<>(1, "Student metrics compiled successfully", analyticsService.getStudentAnalytics(registrationNumber))
            );
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(
                    new ApiResponse<>(0, e.getMessage(), null)
            );
        }
    }
}