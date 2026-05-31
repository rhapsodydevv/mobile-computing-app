package com.example.gps_attendance_backend.controllers;

import com.example.gps_attendance_backend.models.ApiResponse;
import com.example.gps_attendance_backend.models.Units;
import com.example.gps_attendance_backend.respositories.CourseRepository;
import com.example.gps_attendance_backend.respositories.UnitRepository;
import com.example.gps_attendance_backend.services.StudentEnrollmentService;
import com.example.gps_attendance_backend.services.UnitService;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/units")
public class UnitController {

    @Autowired
    private UnitService unitService;

    @Autowired
    private UnitRepository unitRepository;

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private StudentEnrollmentService studentEnrollmentService;

    @Data
    public static class UnitRequest {
        private String unitCode;
        private String unitName;

        private String courseCode;
        private int year;
        private int semester;
    }

    @GetMapping
    public ResponseEntity<ApiResponse> getAllUnits() {
        return ResponseEntity.ok(new ApiResponse<>(1, "Units retrieved successfully", unitService.getAllUnits()));
    }



    @GetMapping("/my-units")
    public ResponseEntity<ApiResponse<List<Units>>> getEnrolledUnits(@RequestParam String registrationNumber) {
        try {
            List<Units> units = studentEnrollmentService.getEnrolledUnitsForStudent(registrationNumber);

            return ResponseEntity.ok(
                    new ApiResponse<>(1, "Enrolled units retrieved successfully", units)
            );

        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(
                    new ApiResponse<>(0, e.getMessage(), null)
            );
        }
    }

    @PostMapping("/new-unit")
    public ResponseEntity<ApiResponse> addUnit(@RequestBody UnitRequest request) {
        if (unitRepository.existsByUnitCode(request.getUnitCode())){
            return ResponseEntity.badRequest().body(new ApiResponse<>(0, "Unit already exists", null));
        }

        Units unit = new Units();
        unit.setUnitCode(request.getUnitCode().trim().replaceAll("\\s+", "-").toUpperCase());
        unit.setUnitName(request.getUnitName());

        if (courseRepository.existsByCourseCodeAndYearAndSemester(request.getCourseCode(), request.getYear(), request.getSemester())){
            unit.setCourse(courseRepository.findByCourseCodeAndYearAndSemester(request.getCourseCode(), request.getYear(), request.getSemester()).get());

        } else {
            return ResponseEntity.badRequest().body(new ApiResponse<>(0, "Course not found for the given course code, academic year and semester", null));
        }

        unit.setCourseCode(request.getCourseCode());
        unit.setSemester(request.getSemester());
        unit.setYear(request.getYear());

        Units savedUnit = unitService.addUnit(unit);

        return ResponseEntity.ok(new ApiResponse<>(1, "Unit added successfully", savedUnit));
    }

    @GetMapping("/{unitCode}")
    public ResponseEntity<ApiResponse> getUnit(@PathVariable String unitCode ){
        try{
            return ResponseEntity.ok(
                    new ApiResponse<>(1, "Unit retrieved successfully", unitService.getUnit(unitCode))
            );

        }catch (RuntimeException e){
            return ResponseEntity.badRequest().body(
                    new ApiResponse<>(0, e.getMessage(), null));
        }
    }




}
