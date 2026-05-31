//package com.example.gps_attendance_backend.controllers;
//
//import com.example.gps_attendance_backend.models.ApiResponse;
//import com.example.gps_attendance_backend.models.UnitAttendanceRecord;
//import com.example.gps_attendance_backend.respositories.UnitRepository;
//import com.example.gps_attendance_backend.respositories.UserRepository;
//import com.example.gps_attendance_backend.services.UnitAttendanceService;
//import com.example.gps_attendance_backend.services.UnitService;
//import lombok.Data;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.PostMapping;
//import org.springframework.web.bind.annotation.RequestBody;
//import org.springframework.web.bind.annotation.RequestMapping;
//import org.springframework.web.bind.annotation.RestController;
//
//import java.time.LocalDateTime;
//
//@RestController
//@RequestMapping("/api/attendance")
//public class UnitAttendanceController {
//    @Autowired
//    private UnitAttendanceService unitAttendanceService;
//
//    @Autowired
//    private UnitRepository unitRepository;
//
//    @Autowired
//    private UserRepository userRepository;
//
//    @Data
//    public static class UnitAttendanceRequest {
//        private String unitCode;
//        private Double latitude;
//        private Double longitude;
//        private String registrationNumber;
//    }
//
//    @PostMapping("/mark")
//    public ResponseEntity<ApiResponse> markAttendance(@RequestBody UnitAttendanceRequest request){
//        if (LocalDateTime.now().isBefore(unitRepository.findByUnitCode(request.getUnitCode()).get().getStartTime()) ||
//                LocalDateTime.now().isAfter(unitRepository.findByUnitCode(request.getUnitCode()).get().getEndTime())) {
//            return ResponseEntity.badRequest().body(
//                    new ApiResponse<>(0, "Attendance cannot be marked because class is not in session", null)
//            );
//        }
//
//        UnitAttendanceRecord record = new UnitAttendanceRecord();
//        record.setLatitude(request.getLatitude());
//        record.setLongitude(request.getLongitude());
//        record.setTimestamp(LocalDateTime.now());
//        if(unitRepository.existsByUnitCode(request.getUnitCode())){
//            record.setUnitCode(request.unitCode);
//            record.setUnit(unitRepository.findByUnitCode(request.unitCode).orElse(null));
//        }
//        if(userRepository.existsByRegistrationNumber(request.getRegistrationNumber())){
//            record.setRegistrationNumber(request.getRegistrationNumber());
//            record.setStudent(userRepository.findByRegistrationNumber(request.getRegistrationNumber()).orElse(null));
//        }
//        UnitAttendanceRecord savedRecord = unitAttendanceService.markAttendance(record);
//
//        return ResponseEntity.ok(
//                new ApiResponse<>(1, "Attendance marked successfully", savedRecord)
//        );
//
//    }
//}
