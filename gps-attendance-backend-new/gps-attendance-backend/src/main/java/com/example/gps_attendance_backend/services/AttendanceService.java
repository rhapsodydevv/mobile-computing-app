package com.example.gps_attendance_backend.services;

import com.example.gps_attendance_backend.controllers.AttendanceController;
import com.example.gps_attendance_backend.controllers.ClassSessionController;
import com.example.gps_attendance_backend.models.Attendance;
import com.example.gps_attendance_backend.models.ClassSession;
import com.example.gps_attendance_backend.models.Classroom;
import com.example.gps_attendance_backend.models.Users;
import com.example.gps_attendance_backend.respositories.AttendanceRepository;
import com.example.gps_attendance_backend.respositories.ClassSessionRepository;
import com.example.gps_attendance_backend.respositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class AttendanceService {
    @Autowired
    private AttendanceRepository attendanceRepository;

    @Autowired
    private ClassSessionRepository classSessionRepository;

    @Autowired
    private UserRepository userRepository;

    public Attendance markAttendance(AttendanceController.MarkAttendanceRequest request) {
        Users student = userRepository.findByRegistrationNumber(request.getRegistrationNumber())
                .orElseThrow(() ->
                        new RuntimeException("Student not found"));

        ClassSession session = classSessionRepository
                .findById(request.getClassSessionId())
                .orElseThrow(() ->
                        new RuntimeException("Class session not found"));

        // Check if attendance already marked
        boolean alreadyMarked =
                attendanceRepository
                        .existsByStudentRegistrationNumberAndClassSession_ClassSessionId(
                                student.getRegistrationNumber(),
                                session.getClassSessionId()
                        );

        if (alreadyMarked) {
            throw new RuntimeException(
                    "Attendance already marked");
        }

        // Check if class is currently active
        LocalDateTime now = LocalDateTime.now();

        if (now.isBefore(session.getStartTime())
                || now.isAfter(session.getEndTime())) {

            throw new RuntimeException(
                    "Class session is not active");
        }

        Classroom classroom = session.getClassroom();

        double classroomLat = classroom.getLatitude();
        double classroomLon = classroom.getLongitude();

        double studentLat = request.getStudentLatitude();
        double studentLon = request.getStudentLongitude();

        // Calculate distance
        double distance =
                calculateDistance(
                        classroomLat,
                        classroomLon,
                        studentLat,
                        studentLon
                );

        // Check geofence
        boolean insideGeofence = distance <= classroom.getRadius();

        if (!insideGeofence) {
            throw new RuntimeException(
                    "You are outside the classroom range");
        }

        Attendance attendance = new Attendance();

        attendance.setStudent(student);
        attendance.setStudentRegistrationNumber(
                student.getRegistrationNumber());

        attendance.setClassSession(session);

        attendance.setUnitCode(session.getUnitCode());

        attendance.setClassroomName(
                classroom.getRoomName());

        attendance.setMarkedAt(now);

        attendance.setStudentLatitude(studentLat);
        attendance.setStudentLongitude(studentLon);

        attendance.setDistanceFromClassroom(distance);

        attendance.setIsInsideGeofence(true);

        return attendanceRepository.save(attendance);

    }

    // Haversine formula
    private double calculateDistance(
            double lat1,
            double lon1,
            double lat2,
            double lon2) {

        final int EARTH_RADIUS = 6371000;

        double latDistance =
                Math.toRadians(lat2 - lat1);

        double lonDistance =
                Math.toRadians(lon2 - lon1);

        double a =
                Math.sin(latDistance / 2)
                        * Math.sin(latDistance / 2)
                        + Math.cos(Math.toRadians(lat1))
                        * Math.cos(Math.toRadians(lat2))
                        * Math.sin(lonDistance / 2)
                        * Math.sin(lonDistance / 2);

        double c =
                2 * Math.atan2(
                        Math.sqrt(a),
                        Math.sqrt(1 - a));

        return EARTH_RADIUS * c;
    }



}
