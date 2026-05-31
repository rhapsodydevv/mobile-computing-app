//package com.example.gps_attendance_backend.services;
//
//import com.example.gps_attendance_backend.models.UnitAttendanceRecord;
//import com.example.gps_attendance_backend.respositories.UnitAttendanceRepository;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.stereotype.Service;
//
//@Service
//public class UnitAttendanceService {
//    @Autowired
//    private UnitAttendanceRepository unitAttendanceRepository;
//
//    public UnitAttendanceRecord markAttendance(UnitAttendanceRecord record){
//        if(record.getLatitude() == null || record.getLongitude() == null || record.getUnitCode() == null){
//            throw new IllegalArgumentException("Latitude and Longitude and Unit code are required to mark attendance.");
//        }
//
//        return unitAttendanceRepository.save(record);
//    }
//}
