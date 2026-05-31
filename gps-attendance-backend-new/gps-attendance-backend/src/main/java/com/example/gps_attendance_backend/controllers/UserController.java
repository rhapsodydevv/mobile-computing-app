package com.example.gps_attendance_backend.controllers;

import com.example.gps_attendance_backend.models.ApiResponse;
import com.example.gps_attendance_backend.models.StudentEnrollment;
import com.example.gps_attendance_backend.respositories.StudentEnrollmentRepository;
import com.example.gps_attendance_backend.respositories.UserRepository;
import com.example.gps_attendance_backend.services.StudentEnrollmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/users")
public class UserController {

    @Autowired
    private StudentEnrollmentService studentEnrollmentService;
    @Autowired
    private StudentEnrollmentRepository studentEnrollmentRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public ResponseEntity<ApiResponse> getAllUsers(){
        return ResponseEntity.ok(
                new ApiResponse<>(1, "Users retrieved successfully", userRepository.findAll())
        );
    }

//    @PostMapping
//    public List<StudentEnrollment> getEnrolled(@RequestBody String registrationNumber ){
//        return studentEnrollmentService.getEnrolledUnitsForStudent(registrationNumber);
//    }







}
