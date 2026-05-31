package com.example.gps_attendance_backend.services;

import com.example.gps_attendance_backend.dtos.AttendanceHistoryDto;
import com.example.gps_attendance_backend.respositories.AttendanceHistoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class AttendanceHistoryService {

    @Autowired
    private AttendanceHistoryRepository historyRepository;

    @Transactional(readOnly = true)
    public List<AttendanceHistoryDto> fetchStudentAttendanceLogs(String registrationNumber) {
        return historyRepository.findHistoryByRegistrationNumber(registrationNumber.trim());
    }
}