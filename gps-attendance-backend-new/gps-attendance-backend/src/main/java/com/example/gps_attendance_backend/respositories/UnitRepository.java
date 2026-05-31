package com.example.gps_attendance_backend.respositories;

import com.example.gps_attendance_backend.models.Units;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface UnitRepository extends JpaRepository<Units, UUID> {
    Optional<Units> findByUnitCode(String unitCode);
    boolean existsByUnitCode(String unitCode);

    List<Units> findByCourse_CourseCodeAndCourse_YearAndCourse_Semester(
            String courseCode,
            int year,
            int semester
    );




}
