package com.example.gps_attendance_backend.respositories;

import com.example.gps_attendance_backend.models.Attendance;
import com.example.gps_attendance_backend.dtos.AttendanceHistoryDto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface AttendanceHistoryRepository extends JpaRepository<Attendance, UUID> {

    @Query("SELECT new com.example.gps_attendance_backend.dtos.AttendanceHistoryDto(" +
            "a.attendanceId, a.unitCode, a.classSession.unit.unitName, " +
            "a.classroomName, a.markedAt, a.isInsideGeofence, a.distanceFromClassroom) " +
            "FROM Attendance a " +
            "WHERE a.studentRegistrationNumber = :regNumber " +
            "ORDER BY a.markedAt DESC")
    List<AttendanceHistoryDto> findHistoryByRegistrationNumber(@Param("regNumber") String regNumber);
}