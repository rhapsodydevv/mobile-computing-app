package com.example.gps_attendance_backend.services;

import com.example.gps_attendance_backend.controllers.ClassSessionController;
import com.example.gps_attendance_backend.models.ClassSession;
import com.example.gps_attendance_backend.models.Classroom;
import com.example.gps_attendance_backend.models.Units;
import com.example.gps_attendance_backend.respositories.ClassSessionRepository;
import com.example.gps_attendance_backend.respositories.ClassroomRepository;
import com.example.gps_attendance_backend.respositories.StudentEnrollmentRepository;
import com.example.gps_attendance_backend.respositories.UnitRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;

@Service
public class ClassSessionService {

    @Autowired
    private UnitRepository unitRepository;

    @Autowired
    private ClassroomRepository classroomRepository;

    @Autowired
    private ClassSessionRepository classSessionRepository;

    @Autowired
    private StudentEnrollmentRepository studentEnrollmentRepository;

    public ClassSession createSession(ClassSessionController.CreateClassSessionRequest request){
        Units unit = unitRepository.findByUnitCode(request.getUnitCode())
                .orElseThrow(() -> new RuntimeException("Unit not found"));

        Classroom classroom = classroomRepository.findByRoomName(request.getRoomName())
                .orElseThrow(() -> new RuntimeException("Classroom not found"));

        // Validate time
        if (request.getStartTime().isAfter(request.getEndTime())
                || request.getStartTime().isEqual(request.getEndTime())) {

            throw new RuntimeException("Start time must be before end time");
        }

        boolean sessionExists =
                classSessionRepository
                        .existsByClassroom_RoomNameAndStartTimeLessThanAndEndTimeGreaterThan(
                                request.getRoomName(),
                                request.getEndTime(),
                                request.getStartTime()
                        );

        if (sessionExists) {
            throw new RuntimeException(
                    "Another class session already exists in this classroom during that time"
            );
        }


        ClassSession session = new ClassSession();

        session.setUnit(unit);
        session.setUnitCode(unit.getUnitCode());

        session.setClassroom(classroom);
        session.setClassroomName(classroom.getRoomName());

        session.setStartTime(request.getStartTime());
        session.setEndTime(request.getEndTime());

        session.setIsActive(true);

        return classSessionRepository.save(session);

    }

    public ClassSession getCurrentActiveSession() {

        LocalDateTime now = LocalDateTime.now();

        return classSessionRepository
                .findFirstByIsActiveTrueAndStartTimeLessThanEqualAndEndTimeGreaterThanEqual(now, now)
                .orElse(null);
    }

    public List<ClassSession> getActiveSessionsForEnrolledUnits(String registrationNumber) {
        if (registrationNumber == null || registrationNumber.trim().isEmpty()) {
            return Collections.emptyList();
        }

        // 1. Get the unit codes the student is registered for
        List<String> enrolledUnitCodes = studentEnrollmentRepository
                .findUnitCodesByStudentRegistrationNumber(registrationNumber.trim());

        // If not enrolled in anything, stop here
        if (enrolledUnitCodes.isEmpty()) {
            return Collections.emptyList();
        }

        // 2. Fetch active sessions within the current time boundary
        LocalDateTime now = LocalDateTime.now();

        return classSessionRepository.findActiveSessionsForUnitCodes(now, enrolledUnitCodes);
    }



}
