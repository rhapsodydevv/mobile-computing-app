package com.example.gps_attendance_backend.controllers;

import com.example.gps_attendance_backend.models.ApiResponse;
import com.example.gps_attendance_backend.models.Course;
import com.example.gps_attendance_backend.services.CourseService;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/courses")
public class CourseController {
    @Autowired
    private CourseService courseService;

    @Data
    public static class CourseRequest{
        private String courseCode;
        private String courseName;
        private int year;
        private int semester;
    }

    @Data
    public static class GetCourseRequest{
        private String courseCode;
        private int year;
        private int semester;
    }

    @GetMapping
    public ResponseEntity<ApiResponse> getAllCourses(){
        return ResponseEntity.ok(
                new ApiResponse<>(1, "Courses retrieved successfully", courseService.getAllCourses())
        );
    }

    @PostMapping("/new-course")
    public ResponseEntity<ApiResponse> addCourse(@RequestBody CourseRequest request){
        try {
            Course course = new Course();
            course.setCourseCode(request.getCourseCode().trim().replaceAll("\\s+", "-").toUpperCase());
            course.setCourseName(request.getCourseName());
            course.setYear(request.getYear());
            course.setSemester(request.getSemester());
            Course savedCourse = courseService.addCourse(course);

            if(request.getCourseName() == null|| request.getCourseCode() == null || request.getYear() == 0 || request.getSemester() == 0){
                return ResponseEntity.badRequest().body(
                        new ApiResponse<>(0, "Course code, course name, academic year and semester are required", null));
            }

            return ResponseEntity.ok(
                    new ApiResponse<>(1, "Course added successfully", savedCourse)
            );
        } catch (RuntimeException e) {
            return ResponseEntity.status(500).body(
                    new ApiResponse<>(0, e.getMessage(), null));
        }

    }

    @GetMapping("/{courseCode}")
    public ResponseEntity<ApiResponse> getCourse(@PathVariable String courseCode ){
        try{
            return ResponseEntity.ok(
                    new ApiResponse<>(1, "Course retrieved successfully", courseService.getCourse(courseCode))
            );

        }catch (RuntimeException e){
            return ResponseEntity.badRequest().body(
                    new ApiResponse<>(0, e.getMessage(), null));
        }
    }

    @GetMapping("/{courseCode}/{year}")
    public ResponseEntity<ApiResponse> getCourseByYear(@PathVariable String courseCode, @PathVariable int year ){
        try{
            return ResponseEntity.ok(
                    new ApiResponse<>(1, "Course retrieved successfully", courseService.getCourseByYear(courseCode, year))
            );

        }catch (RuntimeException e){
            return ResponseEntity.badRequest().body(
                    new ApiResponse<>(0, e.getMessage(), null));
        }
    }

    @GetMapping("/{courseCode}/{year}/{semester}")
    public ResponseEntity<ApiResponse> getCourseByYearAndSemester(@PathVariable String courseCode,
                                                                  @PathVariable int year,
                                                                  @PathVariable int semester){
        try{
            return ResponseEntity.ok(
                    new ApiResponse<>(1, "Course retrieved successfully", courseService.getCourseByYearAndSemester(courseCode, year, semester))
            );

        }catch (RuntimeException e){
            return ResponseEntity.badRequest().body(
                    new ApiResponse<>(0, e.getMessage(), null));
        }
    }


}
