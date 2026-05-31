package com.example.gps_attendance_backend.services;

import com.example.gps_attendance_backend.models.StudentEnrollment;
import com.example.gps_attendance_backend.models.Units;
import com.example.gps_attendance_backend.models.Users;
import com.example.gps_attendance_backend.respositories.StudentEnrollmentRepository;
import com.example.gps_attendance_backend.respositories.UnitRepository;
import com.example.gps_attendance_backend.respositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.User;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class StudentEnrollmentService {
    @Autowired
    private UnitRepository unitRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private StudentEnrollmentRepository studentEnrollmentRepository;


    public void autoEnrollStudent(Users student){

        List<Units> units = unitRepository.findByCourse_CourseCodeAndCourse_YearAndCourse_Semester(
                student.getCourseCode(), student.getYear(), student.getSemester()
        );

        for (Units unit: units){
            StudentEnrollment enrollment = new StudentEnrollment();

            enrollment.setStudent(student);
            enrollment.setStudentRegistrationNumber(student.getRegistrationNumber());
            enrollment.setUnit(unit);
            enrollment.setUnitCode(unit.getUnitCode());

            studentEnrollmentRepository.save(enrollment);
        }

    }

    public List<Units> getEnrolledUnitsForStudent(String registrationNumber) {
        return studentEnrollmentRepository.findByStudentRegistrationNumber(registrationNumber)
                .stream()
                .map(enrollment -> enrollment.getUnit()) // Extract the unit object
                .filter(unit -> unit != null)            // Safeguard against orphan enrollments
                .distinct()                              // Ensures duplicate unit records aren't returned
                .collect(Collectors.toList());
    }

//    @Autowired
//    private StudentEnrollmentRepository studentEnrollmentRepository;
//
//    @Autowired
//    private UnitRepository unitRepository;
//
//    public void autoEnrollStudent(Users student) {
//
//        List<Units> units = unitRepository
//                .findByCourse_CourseCodeAndCourse_YearAndCourse_Semester(
//                        student.getCourseCode(),
//                        student.getYear(),
//                        student.getSemester()
//                );
//
//        for (Units unit : units) {
//
//            boolean alreadyEnrolled =
//                    studentEnrollmentRepository.existsByStudentAndUnit(student, unit);
//
//            if (!alreadyEnrolled) {
//
//                StudentEnrollment enrollment = new StudentEnrollment();
//
//                enrollment.setStudent(student);
//                enrollment.setUnit(unit);
//
//                studentEnrollmentRepository.save(enrollment);
//            }
//        }
//    }

}
