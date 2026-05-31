package com.example.gps_attendance_backend.config;

import com.example.gps_attendance_backend.models.UserRole;
import com.example.gps_attendance_backend.models.Users;
import com.example.gps_attendance_backend.respositories.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Set;

@Configuration
public class DataInitializer {
    @Bean
    CommandLineRunner initDatabase(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            String adminEmail = "admin@jkuat.com";

            if (userRepository.findByEmail(adminEmail).isEmpty()) {
                Users admin = new Users();
                admin.setEmail(adminEmail);
                admin.setFirstName("System");
                admin.setLastName("Admin");
                admin.setRegistrationNumber("ABC000-000/0000");
                // Securely hash the default password "admin123"
                admin.setPassword(passwordEncoder.encode("admin123"));
                // Using the Enum way
                admin.setRoles(Set.of(UserRole.ADMIN, UserRole.LECTURER, UserRole.STUDENT));

                userRepository.save(admin);
                System.out.println("Default Admin created: " + adminEmail);
            }
        };
    }
}
