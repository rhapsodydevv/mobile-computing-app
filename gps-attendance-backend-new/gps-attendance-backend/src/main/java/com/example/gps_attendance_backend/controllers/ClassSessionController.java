package com.example.gps_attendance_backend.controllers;

import com.example.gps_attendance_backend.models.ApiResponse;
import com.example.gps_attendance_backend.models.ClassSession;
import com.example.gps_attendance_backend.models.Course;
import com.example.gps_attendance_backend.respositories.ClassSessionRepository;
import com.example.gps_attendance_backend.respositories.ClassroomRepository;
import com.example.gps_attendance_backend.respositories.StudentEnrollmentRepository;
import com.example.gps_attendance_backend.respositories.UnitRepository;
import com.example.gps_attendance_backend.services.ClassSessionService;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("api/class-sessions")
public class ClassSessionController {

    @Autowired
    private ClassSessionService classSessionService;

    @Autowired
    private ClassroomRepository classroomRepository;

    @Autowired
    private UnitRepository unitRepository;

    @Autowired
    private ClassSessionRepository classSessionRepository;

    @Autowired
    private StudentEnrollmentRepository studentEnrollmentRepository;

    @Data
    public static class CreateClassSessionRequest{
        private String unitCode;
        private String roomName;
        private LocalDateTime startTime;
        private LocalDateTime endTime;
    }

    @GetMapping
    public ResponseEntity<ApiResponse> getAllClassSessions(){
        return ResponseEntity.ok(
                new ApiResponse<>(1, "Class sessions retrieved successfully", classSessionRepository.findAll())
        );
    }

    @PostMapping("/new-class")
    public ResponseEntity<ApiResponse> addClass(@RequestBody CreateClassSessionRequest request){
        try {

            if (request.getUnitCode() == null
                    || request.getRoomName() == null
                    || request.getStartTime() == null
                    || request.getEndTime() == null) {

                return ResponseEntity.badRequest().body(
                        new ApiResponse<>(0,
                                "Fill in all the fields",
                                null)
                );
            }

            ClassSession session = new ClassSession();

            session.setUnit(unitRepository.findByUnitCode(request.getUnitCode()).get());
            session.setUnitCode(request.getUnitCode());

            session.setClassroom(classroomRepository.findByRoomName(request.getRoomName()).get());
            session.setClassroomName(request.getRoomName());

            session.setStartTime(request.getStartTime());
            session.setEndTime(request.getEndTime());

            session.setIsActive(true);

            ClassSession savedSession = classSessionService.createSession(request);

            return ResponseEntity.ok(
                    new ApiResponse<>(1, "Class session added successfully", savedSession)
            );
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(
                    new ApiResponse<>(0, e.getMessage(), null));
        }

    }

    @GetMapping("/active")
    public ResponseEntity<ApiResponse<List<ClassSession>>> getActiveSessionsForStudent(
            @RequestParam String registrationNumber) {

        try {
//            List<ClassSession> activeSessions = classSessionService
//                    .getActiveSessionsForEnrolledUnits(registrationNumber);

            List<ClassSession> activeSessions = classSessionRepository.findByIsActiveTrue();

            if (activeSessions.isEmpty()) {
                return ResponseEntity.ok(
                        new ApiResponse<>(1, "No active class sessions found for your enrolled units", Collections.emptyList())
                );
            }

            return ResponseEntity.ok(
                    new ApiResponse<>(1, "Active class sessions retrieved successfully", activeSessions)
            );

        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(
                    new ApiResponse<>(0, "Error retrieving active sessions: " + e.getMessage(), null)
            );
        }
    }

//    @GetMapping("/active")
//    public ResponseEntity<ApiResponse> getActiveClassSession() {
//
//        try {
//
//            ClassSession activeSession = classSessionService.getCurrentActiveSession();
//
//            if (activeSession == null) {
//                return ResponseEntity.ok(
//                        new ApiResponse(
//                                0,
//                                "No active class session found",
//                                null
//                        )
//                );
//            }
//
//            return ResponseEntity.ok(
//                    new ApiResponse(
//                            1,
//                            "Active class session found",
//                            activeSession
//                    )
//            );
//
//        } catch (Exception e) {
//
//            return ResponseEntity.internalServerError().body(
//                    new ApiResponse(
//                            0,
//                            "Error retrieving active session: " + e.getMessage(),
//                            null
//                    )
//            );
//        }
//    }



}
