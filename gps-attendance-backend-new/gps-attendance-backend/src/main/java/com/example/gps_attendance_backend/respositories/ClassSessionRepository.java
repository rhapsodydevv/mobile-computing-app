package com.example.gps_attendance_backend.respositories;

import com.example.gps_attendance_backend.models.ClassSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ClassSessionRepository extends JpaRepository<ClassSession, UUID> {
    // Custom query to fetch active class sessions for a specific student's registered units
//    @Query("SELECT cs FROM ClassSession cs " +
//            "JOIN StudentEnrollment se ON se.unit.id = cs.unit.id " +
//            "WHERE se.student.id = :studentId " +
//            "AND cs.isActive = true " +
//            "AND :now BETWEEN cs.startTime AND cs.endTime")
//    List<ClassSession> findActiveSessionsForStudent(@Param("studentId") UUID studentId, @Param("now") LocalDateTime now);

    List<ClassSession> findByUnit_UnitCode(String unitCode);

    List<ClassSession> findByClassroom_RoomName(String roomName);

    //existing.startTime < newEndTime
    //AND
    //existing.endTime > newStartTime
    boolean existsByClassroom_RoomNameAndStartTimeLessThanAndEndTimeGreaterThan(
            String roomName,
            LocalDateTime endTime,
            LocalDateTime startTime
    );

    // Find active session by current time
    Optional<ClassSession> findFirstByIsActiveTrueAndStartTimeLessThanEqualAndEndTimeGreaterThanEqual(
            LocalDateTime currentTime1,
            LocalDateTime currentTime2
    );

    List<ClassSession> findByIsActiveTrue();

    // Used to find classes that just ended and are still marked active
    List<ClassSession> findByIsActiveTrueAndEndTimeLessThan(LocalDateTime time);

    // Count how many sessions have happened for a single unit
    long countByUnitCode(String unitCode);

    // List all historical sessions of a unit
    List<ClassSession> findByUnitCode(String unitCode);

    // Find all active sessions matching the current timestamp and a list of enrolled unit codes
    @Query("SELECT cs FROM ClassSession cs WHERE cs.isActive = true " +
            "AND :currentTime BETWEEN cs.startTime AND cs.endTime " +
            "AND cs.unitCode IN :unitCodes")
    List<ClassSession> findActiveSessionsForUnitCodes(
            @Param("currentTime") LocalDateTime currentTime,
            @Param("unitCodes") List<String> unitCodes
    );




}
