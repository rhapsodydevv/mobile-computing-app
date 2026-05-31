package com.example.gps_attendance_backend.controllers;

import com.example.gps_attendance_backend.models.ApiResponse;
import com.example.gps_attendance_backend.models.Attendance;
import com.example.gps_attendance_backend.respositories.ClassSessionRepository;
import com.example.gps_attendance_backend.services.AttendanceService;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.UUID;

@RestController
@RequestMapping("api/attendances")
public class AttendanceController {
    @Autowired
    private ClassSessionRepository classSessionRepository;
    @Autowired
    private AttendanceService attendanceService;

    @Data
    public static class MarkAttendanceRequest {
        //private String unitCode;
        private String registrationNumber;
        private UUID classSessionId;

        private Double studentLatitude;
        private Double studentLongitude;
    }

    @Data
    public static class AttendanceLogResponse{
        private UUID attendanceId;
        private String unitCode;
        private String unitName;
        private String classroomName;
        private LocalDateTime markedAt;
        private Boolean isInsideGeofence;
        private Double distanceFromClassroom;
    }

    @PostMapping("/mark")
    public ResponseEntity<ApiResponse> markAttendance(
            @RequestBody MarkAttendanceRequest request) {

        try {

            if (request.getRegistrationNumber() == null
                    || request.getClassSessionId() == null
                    || request.getStudentLatitude() == null
                    || request.getStudentLongitude() == null) {

                return ResponseEntity.badRequest().body(
                        new ApiResponse<>(
                                0,
                                "Fill in all fields",
                                null
                        )
                );
            }

            Attendance attendance =
                    attendanceService.markAttendance(request);

            return ResponseEntity.ok(
                    new ApiResponse<>(
                            1,
                            "Attendance marked successfully",
                            attendance
                    )
            );

        } catch (RuntimeException e) {

            return ResponseEntity.badRequest().body(
                    new ApiResponse<>(
                            0,
                            e.getMessage(),
                            null
                    )
            );
        }
    }









//    @PostMapping("/mark")
//    public ResponseEntity<ApiResponse> markAttendance(@RequestBody AttendanceRequest request){
//        if (LocalDateTime.now().isBefore(classSessionRepository.findByUnit_UnitCode(request.getUnitCode()).get ||
//                LocalDateTime.now().isAfter(classSessionRepository.findById(request.getUnitCode()).get().getEndTime())) {
//            return ResponseEntity.badRequest().body(
//                    new ApiResponse<>(0, "Attendance cannot be marked because class is not in session", null)
//            );
//        }
//
//        Attendance record = new Attendance();
//        record.setStudentLatitude(request.getStudentLatitude());
//        record.setStudentLongitude(request.getStudentLongitude());
//        record.setMarkedAt(LocalDateTime.now());
//
////        if(unitRepository.existsByUnitCode(request.getUnitCode())){
////            record.setUnitCode(request.unitCode);
////            record.setUnit(unitRepository.findByUnitCode(request.unitCode).orElse(null));
////        }
////        if(userRepository.existsByRegistrationNumber(request.getRegistrationNumber())){
////            record.setRegistrationNumber(request.getRegistrationNumber());
////            record.setStudent(userRepository.findByRegistrationNumber(request.getRegistrationNumber()).orElse(null));
////        }
//        Attendance savedRecord = attendanceService.markAttendance(record);
//
//        return ResponseEntity.ok(
//                new ApiResponse<>(1, "Attendance marked successfully", savedRecord)
//        );
//
//    }

}
