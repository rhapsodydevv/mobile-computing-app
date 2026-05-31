package com.example.gps_attendance_backend.respositories;

import com.example.gps_attendance_backend.controllers.AttendanceController;
import com.example.gps_attendance_backend.models.Attendance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface AttendanceRepository extends JpaRepository<Attendance, UUID> {
    Optional<Attendance> findByStudent_UserIdAndClassSession_ClassSessionId(
            UUID studentId,
            UUID classSessionId
    );

    boolean existsByStudentRegistrationNumberAndClassSession_ClassSessionId(
            String registrationNumber,
            UUID classSessionId
    );

    // Count total check-ins for a specific class session
    long countByClassSession_ClassSessionId(UUID classSessionId);

    // Count total check-ins for a single unit code
    long countByUnitCode(String unitCode);

    // Count how many classes a specific student attended in a given unit
    long countByStudentRegistrationNumberAndUnitCode(String registrationNumber, String unitCode);

    // Count overall check-ins by a student across all units
    long countByStudentRegistrationNumber(String registrationNumber);

//    @Query("SELECT new com.example.gps_attendance_backend.dto.AttendanceLogResponse(" +
//            "a.attendanceId, a.unitCode, a.classSession.unit.unitName, " +
//            "a.classroomName, a.markedAt, a.isInsideGeofence, a.distanceFromClassroom) " +
//            "FROM Attendance a " +
//            "WHERE a.studentRegistrationNumber = :regNumber " +
//            "ORDER BY a.markedAt DESC")
//    List<AttendanceController.AttendanceLogResponse> findLogsByRegistrationNumber(@Param("regNumber") String regNumber);




}
