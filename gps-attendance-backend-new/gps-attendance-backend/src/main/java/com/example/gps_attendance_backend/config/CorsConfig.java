package com.example.gps_attendance_backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig {
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**") // Allow all endpoints
                        .allowedOrigins("http://localhost:3000", "http://localhost:5173", "http://localhost:8081",
                                "http://192.168.100.180:8080", "exp://192.168.100.180:8081",
                                "http://192.168.100.104:8080", "exp://192.168.0.104:8081") // React's default URL
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // Allowed HTTP methods
                        .allowedHeaders("*") // Allow all headers (Content-Type, Authorization, etc.)
                        .allowCredentials(true); // Allow cookies/auth headers if needed
            }
        };
    }
}
