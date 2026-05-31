package com.example.gps_attendance_backend.services;

import com.example.gps_attendance_backend.models.Course;
import com.example.gps_attendance_backend.respositories.CourseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CourseService {
    @Autowired
    private CourseRepository courseRepository;

    public List<Course> getAllCourses(){
        return courseRepository.findAll();
    }

    public Course addCourse(Course course){
        if (courseRepository.existsByCourseCodeAndYearAndSemester(course.getCourseCode(), course.getYear(), course.getSemester())){
            throw new RuntimeException("Course with code " + course.getCourseCode() + " already exists for the academic year " + course.getYear() + " and semester " + course.getSemester());
        }

        return courseRepository.save(course);
    }

    public Course getCourse(String courseCode){
        return courseRepository.findByCourseCode(courseCode)
                .orElseThrow(()-> new RuntimeException("Course not found with code: " + courseCode));
    }

    public Course getCourseByYearAndSemester(String courseCode, int year, int semester){
        return courseRepository.findByCourseCodeAndYearAndSemester(courseCode, year, semester)
                .orElseThrow(()-> new RuntimeException("Course not found with code: " + courseCode + " for the academic year " + year + " and semester " + semester));
    }

    public Course getCourseByYear(String courseCode, int year){
        return courseRepository.findByCourseCodeAndYear(courseCode, year)
                .orElseThrow(()-> new RuntimeException("Course not found with code: " + courseCode + " for the academic year " + year));
    }

}
