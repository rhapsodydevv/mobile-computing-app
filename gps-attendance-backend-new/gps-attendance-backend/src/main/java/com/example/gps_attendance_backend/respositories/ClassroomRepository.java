package com.example.gps_attendance_backend.respositories;

import com.example.gps_attendance_backend.models.Classroom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface ClassroomRepository extends JpaRepository<Classroom, UUID> {

    Optional<Classroom> findByRoomName(String roomName);
}
