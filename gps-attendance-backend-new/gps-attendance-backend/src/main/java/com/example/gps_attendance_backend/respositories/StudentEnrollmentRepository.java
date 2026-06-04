package com.example.gps_attendance_backend.respositories;

import com.example.gps_attendance_backend.models.StudentEnrollment;
import com.example.gps_attendance_backend.models.Units;
import com.example.gps_attendance_backend.models.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface StudentEnrollmentRepository extends JpaRepository<StudentEnrollment, UUID> {
    boolean existsByStudentAndUnit(Users student, Units unit);

    List<StudentEnrollment> findByStudentRegistrationNumber(String registrationNumber);

    List<StudentEnrollment> findByStudent(Users student);

    List<StudentEnrollment> findByStudent_UserId(UUID userId);

    List<StudentEnrollment> findByStudent_RegistrationNumber(String registrationNumber);

    // Fetch only the unit codes for a specific student registration number
    @Query("SELECT se.unitCode FROM StudentEnrollment se WHERE TRIM(se.studentRegistrationNumber) = TRIM(:regNo)")
    List<String> findUnitCodesByStudentRegistrationNumber(@Param("regNo") String registrationNumber);

}
