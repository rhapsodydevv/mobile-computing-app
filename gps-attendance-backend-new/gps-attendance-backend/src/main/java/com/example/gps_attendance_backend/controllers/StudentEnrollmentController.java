package com.example.gps_attendance_backend.controllers;

import com.example.gps_attendance_backend.models.ApiResponse;
import com.example.gps_attendance_backend.models.StudentEnrollment;
import com.example.gps_attendance_backend.models.Users;
import com.example.gps_attendance_backend.respositories.StudentEnrollmentRepository;
import com.example.gps_attendance_backend.respositories.UserRepository;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.swing.text.html.Option;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/enrollments")
public class StudentEnrollmentController {

    @Data
    public static class EnrollmentRequest{
        private String registrationNumber;
    }

    @Data
    public static class UnitResponse{
        private String unitCode;
        private String unitName;
    }

    @Autowired
    private StudentEnrollmentRepository studentEnrollmentRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public ResponseEntity<ApiResponse> getAllEnrollments(){
        try{
            return ResponseEntity.ok(
                    new ApiResponse<>(1, "Enrollments retrieved successfully", studentEnrollmentRepository.findAll())
            );

        }catch (RuntimeException e){
            return ResponseEntity.badRequest().body(
                    new ApiResponse<>(0, e.getMessage(), null));
        }
    }

    @PostMapping("/my-enrollments")
    public ResponseEntity<ApiResponse> getMyEnrollments(@RequestBody EnrollmentRequest enrollmentRequest){
        try{

            List<StudentEnrollment> enrollments = studentEnrollmentRepository
                            .findByStudentRegistrationNumber(enrollmentRequest.getRegistrationNumber());

            return ResponseEntity.ok(
                    new ApiResponse<>(1, "Enrollments retrieved successfully", enrollments)
            );

        }catch (RuntimeException e){
            return ResponseEntity.badRequest().body(
                    new ApiResponse<>(0, e.getMessage(), null));
        }
    }
}
