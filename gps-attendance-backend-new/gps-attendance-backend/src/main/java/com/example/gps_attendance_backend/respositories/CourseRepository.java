package com.example.gps_attendance_backend.respositories;

import com.example.gps_attendance_backend.models.Course;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface CourseRepository extends JpaRepository<Course, UUID> {
    boolean existsByCourseCode(String courseCode);
    Optional<Course> findByCourseCode(String courseCode);

    Optional<Course> findByCourseCodeAndYear(String courseCode, int year);
    boolean existsByCourseCodeAndYear(String courseCode, int year);

    Optional<Course> findByCourseCodeAndYearAndSemester(String courseCode, int year, int semester);
    boolean existsByCourseCodeAndYearAndSemester(String courseCode, int year, int semester);
}
