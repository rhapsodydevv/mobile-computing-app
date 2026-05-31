package com.example.gps_attendance_backend.controllers;

import com.example.gps_attendance_backend.config.JwtUtils;
import com.example.gps_attendance_backend.models.*;
import com.example.gps_attendance_backend.respositories.CourseRepository;
import com.example.gps_attendance_backend.respositories.UnitRepository;
import com.example.gps_attendance_backend.respositories.UserRepository;
import com.example.gps_attendance_backend.services.StudentEnrollmentService;
import com.example.gps_attendance_backend.services.UserService;
import jakarta.persistence.ManyToOne;
import lombok.Data;
import org.apache.catalina.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    private UserService userService;

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private UnitRepository unitRepository;


    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    //private final EmailService emailService;
    private final JwtUtils jwtUtils;
    private final StudentEnrollmentService studentEnrollmentService;


    public AuthController(UserRepository userRepository, PasswordEncoder passwordEncoder, AuthenticationManager authenticationManager,
                          JwtUtils jwtUtils, StudentEnrollmentService studentEnrollmentService
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtUtils = jwtUtils;
        this.studentEnrollmentService = studentEnrollmentService;
    }

    @Data
    public static class SignUpRequest {
        private String firstName;
        private String lastName;

        private String email;
        private String password;

        private String registrationNumber;

        private String courseCode;
        private int year;
        private int semester;

        private Set<UserRole> roles;

    }

    @Data
    public static class LoginRequest{
        private String email;
        private String password;
    }

    @Data
    public static class JwtResponse{
        private String token;
        private String registrationNumber;
        private String email;
        private String firstName;
        private String role;
    }


    @PostMapping("/sign-up")
    public ResponseEntity<ApiResponse> signUp(@RequestBody SignUpRequest request) {
        try {
            Users user = new Users();
            user.setFirstName(request.getFirstName());
            user.setLastName(request.getLastName());
            user.setEmail(request.getEmail());
            user.setRegistrationNumber(request.getRegistrationNumber());
            user.setPassword(passwordEncoder.encode(request.getPassword()));

            // Assign roles
            Set<UserRole> roles = (request.getRoles() == null || request.getRoles().isEmpty())
                    ? Set.of(UserRole.STUDENT)
                    : request.getRoles();
            user.setRoles(roles);

            if (roles.contains(UserRole.STUDENT)){
                if (request.getYear()==0 || request.getSemester()==0){
                    return ResponseEntity.badRequest().body(
                            new ApiResponse<>(0, "Enter a valid year or semester", null)
                    );
                }
                if (request.getCourseCode()==null){
                    return ResponseEntity.badRequest().body(
                            new ApiResponse<>(0, "Enter a valid course code", null)
                    );
                }

                //Does course exist?
                if (courseRepository.existsByCourseCodeAndYearAndSemester(request.getCourseCode(), request.getYear(), request.getSemester())) {
                    user.setCourse(courseRepository.findByCourseCodeAndYearAndSemester(request.getCourseCode(), request.getYear(), request.getSemester())
                            .orElse(null));
                } else {
                    return ResponseEntity.badRequest().body(new ApiResponse<>(0, "Course not found for the given course code, academic year and semester", null));
                }

                user.setCourseCode(request.getCourseCode());
                user.setYear(request.getYear());
                user.setSemester(request.getSemester());

                List<Units> units = unitRepository.findByCourse_CourseCodeAndCourse_YearAndCourse_Semester(
                        request.getCourseCode(), request.getYear(), request.getSemester()
                );

            }

            Users savedUser = userService.signUp(user);

            studentEnrollmentService.autoEnrollStudent(savedUser);

            return ResponseEntity.ok(
                    new ApiResponse<>(1, "User registered successfully", savedUser)
            );

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(0, e.getMessage(), null));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(0, e.getMessage(), null));
        }
    }

    //Login
    @PostMapping("/login")
    public ResponseEntity<ApiResponse> login(@RequestBody LoginRequest request, JwtResponse response) {
        try {

            if (userRepository.findByEmail(request.getEmail()).isEmpty()) {
                return ResponseEntity.badRequest().body(
                        new ApiResponse<>(0, "Invalid email or password", null));
            }

            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getEmail(),
                            request.getPassword()
                    )
            );

            SecurityContextHolder.getContext().setAuthentication(authentication);

            UserDetails userPrincipal = (UserDetails) authentication.getPrincipal();
            Set<String> roles = userPrincipal.getAuthorities().stream()
                    .map(item -> item.getAuthority())
                    .collect(Collectors.toSet());

            // 3. Generate the token
            String jwt = jwtUtils.generateToken(userPrincipal.getUsername(), roles);
            response.setFirstName(userRepository.findByEmail(request.getEmail()).get().getFirstName());
            response.setRegistrationNumber(userRepository.findByEmail(request.getEmail()).get().getRegistrationNumber());
            response.setEmail(userRepository.findByEmail(request.getEmail()).get().getEmail());
            response.setRole(userRepository.findByEmail(response.getEmail()).get().getRoles().toString());
            response.setToken(jwt);

            return ResponseEntity.ok(
                    new ApiResponse<>(1, "Login successful", response)
            );


        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ApiResponse<>(0, "Invalid credentials", null));
        }
    }
}
