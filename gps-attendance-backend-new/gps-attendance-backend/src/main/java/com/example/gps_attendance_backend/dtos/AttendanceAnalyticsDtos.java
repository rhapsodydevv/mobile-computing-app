package com.example.gps_attendance_backend.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import java.util.List;
import java.util.Map;

public class AttendanceAnalyticsDtos {

    // 1. Overall attendance across ALL units
    @Data
    @AllArgsConstructor
    public static class OverallSystemAnalytics {
        private long totalExpectedAttendances; // Total student-session slots
        private long totalMarkedAttendances;   // Total check-ins
        private double overallAttendanceRate;  // Percentage
        private Map<String, Double> attendanceRateByUnit; // Breakdown per Unit Code
    }

    // 2. Performance Breakdown for a single Unit
    @Data
    @AllArgsConstructor
    public static class UnitAnalytics {
        private String unitCode;
        private long totalSessionsConducted;
        private long totalExpectedAttendance;
        private long totalPresentCount;
        private double unitAttendanceRate;
    }

    // 3. Analytics Profile for an Individual Student
    @Data
    @AllArgsConstructor
    public static class StudentAttendanceAnalytics {
        private String registrationNumber;
        private String studentName;
        private double cumulativeAttendanceRate; // Overall rate across all their registered units
        private List<StudentUnitBreakdown> unitBreakdowns;
    }

    @Data
    @AllArgsConstructor
    public static class StudentUnitBreakdown {
        private String unitCode;
        private long totalSessions;
        private long sessionsAttended;
        private double attendanceRate;
    }
}