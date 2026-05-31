package com.example.gps_attendance_backend.services;

import com.example.gps_attendance_backend.dtos.AttendanceAnalyticsDtos.*;
import com.example.gps_attendance_backend.models.ClassSession;
import com.example.gps_attendance_backend.models.Users;
import com.example.gps_attendance_backend.respositories.AttendanceRepository;
import com.example.gps_attendance_backend.respositories.ClassSessionRepository;
import com.example.gps_attendance_backend.respositories.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
public class AttendanceAnalyticsService {

    @Autowired
    private AttendanceRepository attendanceRepository;

    @Autowired
    private ClassSessionRepository classSessionRepository;

    @Autowired
    private UserRepository userRepository;

    /**
     * 1. AUTOMATED TRIGGER: Immediately processing sessions after they end.
     * Runs every 60 seconds. Finds classes whose endTime has passed,
     * logs analytics data, and turns them 'inactive'.
     */
    @Scheduled(fixedRate = 60000)
    @Transactional
    public void processEndedClassSessions() {
        LocalDateTime now = LocalDateTime.now();
        List<ClassSession> endedSessions = classSessionRepository.findByIsActiveTrueAndEndTimeLessThan(now);

        for (ClassSession session : endedSessions) {
            log.info("Processing post-lesson analytics for Session ID: {}, Unit: {}",
                    session.getClassSessionId(), session.getUnitCode());

            long presentCount = attendanceRepository.countByClassSession_ClassSessionId(session.getClassSessionId());
            long totalStudentsEnrolled = userRepository.count(); // Fallback baseline: all students in system

            double sessionAttendanceRate = totalStudentsEnrolled > 0
                    ? ((double) presentCount / totalStudentsEnrolled) * 100 : 0.0;

            log.info("--- LESSON ANALYTICS SUMMARY [{}] ---", session.getUnitCode());
            log.info("Total Checked-in: {} / {} Expected Students", presentCount, totalStudentsEnrolled);
            log.info("Session Turnout Rate: {}%", String.format("%.2f", sessionAttendanceRate));

            // Close the session safely so it's not repeatedly evaluated
            session.setIsActive(false);
            classSessionRepository.save(session);
        }
    }

    /**
     * 2. ANALYTICS REQUIREMENT: Overall Attendance Across all Units
     */
    public OverallSystemAnalytics getOverallSystemAnalytics() {
        long totalSessions = classSessionRepository.count();
        long totalStudents = userRepository.count();
        long totalExpected = totalSessions * totalStudents;
        long totalMarked = attendanceRepository.count();

        double overallRate = totalExpected > 0 ? ((double) totalMarked / totalExpected) * 100 : 0.0;

        // Group rates dynamically per unit code
        Map<String, Double> unitBreakdown = new HashMap<>();
        List<ClassSession> allSessions = classSessionRepository.findAll();

        for (ClassSession session : allSessions) {
            String code = session.getUnitCode();
            long attendedInUnit = attendanceRepository.countByUnitCode(code);
            long totalUnitSessions = classSessionRepository.countByUnitCode(code);
            long expectedInUnit = totalUnitSessions * totalStudents;

            double unitRate = expectedInUnit > 0 ? ((double) attendedInUnit / expectedInUnit) * 100 : 0.0;
            unitBreakdown.put(code, Math.round(unitRate * 100.0) / 100.0);
        }

        return new OverallSystemAnalytics(totalExpected, totalMarked, Math.round(overallRate * 100.0) / 100.0, unitBreakdown);
    }

    /**
     * 3. ANALYTICS REQUIREMENT: Individual Attendance Profile inside a chosen Unit
     */
    public UnitAnalytics getUnitAnalytics(String unitCode) {
        long totalSessions = classSessionRepository.countByUnitCode(unitCode);
        long totalStudents = userRepository.count();
        long totalExpected = totalSessions * totalStudents;
        long presentCount = attendanceRepository.countByUnitCode(unitCode);

        double rate = totalExpected > 0 ? ((double) presentCount / totalExpected) * 100 : 0.0;

        return new UnitAnalytics(unitCode, totalSessions, totalExpected, presentCount, Math.round(rate * 100.0) / 100.0);
    }

    /**
     * 4. ANALYTICS REQUIREMENT: Overall Attendance and Unit Breakdown for an individual Student
     */
    public StudentAttendanceAnalytics getStudentAnalytics(String registrationNumber) {
        Users student = userRepository.findByRegistrationNumber(registrationNumber)
                .orElseThrow(() -> new RuntimeException("Student not found tracking analytics"));

        long totalSystemSessions = classSessionRepository.count();
        long studentTotalAttended = attendanceRepository.countByStudentRegistrationNumber(registrationNumber);

        double cumulativeRate = totalSystemSessions > 0
                ? ((double) studentTotalAttended / totalSystemSessions) * 100 : 0.0;

        // Fetch metrics broken down by individual unit categories
        List<StudentUnitBreakdown> breakdowns = new ArrayList<>();

        // Find distinct unit codes from system history
        List<String> distinctUnitCodes = classSessionRepository.findAll().stream()
                .map(ClassSession::getUnitCode)
                .distinct()
                .toList();

        for (String unitCode : distinctUnitCodes) {
            long totalUnitSessions = classSessionRepository.countByUnitCode(unitCode);
            long studentAttendedInUnit = attendanceRepository.countByStudentRegistrationNumberAndUnitCode(registrationNumber, unitCode);

            double unitRate = totalUnitSessions > 0
                    ? ((double) studentAttendedInUnit / totalUnitSessions) * 100 : 0.0;

            breakdowns.add(new StudentUnitBreakdown(
                    unitCode,
                    totalUnitSessions,
                    studentAttendedInUnit,
                    Math.round(unitRate * 100.0) / 100.0
            ));
        }

        return new StudentAttendanceAnalytics(
                student.getRegistrationNumber(),
                "Student Name Placeholder", // Map this safely from your User entity getter if available
                Math.round(cumulativeRate * 100.0) / 100.0,
                breakdowns
        );
    }
}