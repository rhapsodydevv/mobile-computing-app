//package com.example.gps_attendance_backend.config;
//
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.web.servlet.config.annotation.CorsRegistry;
//import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
//
//@Configuration
//public class WebConfig {
//    @Bean
//    public WebMvcConfigurer corsConfigurer(){
//        return new WebMvcConfigurer() {
//            @Override
//            public void addCorsMappings(CorsRegistry registry){
//                registry.addMapping("/**")
//                        .allowedOrigins("http://localhost:8080", "http://192.168.100.1:8080", "http://192.168.100.169:8080", "exp://192.168.100.159:8081",
//                                "http://10.141.198.1:8080")
//                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
//                        .allowCredentials(true);
//            }
//        };
//    }
//}
