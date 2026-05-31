package com.example.gps_attendance_backend.respositories;

import com.example.gps_attendance_backend.models.Users;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface UserRepository extends JpaRepository<Users, UUID> {
    boolean existsByRegistrationNumber(String registrationNumber);
    Optional<Users> findByRegistrationNumber(String registrationNumber);

    boolean existsByEmail(String email);
    Optional<Users> findByEmail(String email);
}
