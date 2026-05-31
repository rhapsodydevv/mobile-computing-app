package com.example.gps_attendance_backend.controllers;

import com.example.gps_attendance_backend.models.ApiResponse;
import com.example.gps_attendance_backend.models.Classroom;
import com.example.gps_attendance_backend.models.Course;
import com.example.gps_attendance_backend.respositories.ClassroomRepository;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/classrooms")
public class ClassroomController {
    @Autowired
    private ClassroomRepository classroomRepository;

    @Data
    public static class NewClassroomRequest{
        private String roomName;
        private Double latitude;
        private Double longitude;

    }

    @GetMapping
    public ResponseEntity<ApiResponse> getAllClassrooms(){
        return ResponseEntity.ok(
                new ApiResponse<>(1, "Classrooms retrieved successfully", classroomRepository.findAll())
        );
    }

    @PostMapping("/new-classroom")
    public ResponseEntity<ApiResponse> addClassroom(@RequestBody NewClassroomRequest request){
        try {

            if(request.getRoomName() == null){
                return ResponseEntity.badRequest().body(
                        new ApiResponse<>(0, "Room name required", null));
            }

            if(classroomRepository.findByRoomName(request.getRoomName()).isPresent()){
                return ResponseEntity.badRequest().body(
                        new ApiResponse<>(0, "Room already exists", null));
            }

            if(request.getLatitude() == null|| request.getLongitude() == null){
                return ResponseEntity.badRequest().body(
                        new ApiResponse<>(0, "Longitude and Latitude required", null));
            }

            Classroom classroom = new Classroom();
            classroom.setRoomName(request.getRoomName().trim().replaceAll("\\s+", "-").toUpperCase());
            classroom.setLatitude(request.getLatitude());
            classroom.setLongitude(request.getLongitude());
            Classroom savedClassroom = classroomRepository.save(classroom);

            return ResponseEntity.ok(
                    new ApiResponse<>(1, "Classroom added successfully", savedClassroom)
            );
        } catch (RuntimeException e) {
            return ResponseEntity.status(500).body(
                    new ApiResponse<>(0, e.getMessage(), null));
        }

    }


}
