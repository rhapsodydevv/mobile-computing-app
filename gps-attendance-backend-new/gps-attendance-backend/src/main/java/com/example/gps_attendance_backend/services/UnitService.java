package com.example.gps_attendance_backend.services;

import com.example.gps_attendance_backend.models.Course;
import com.example.gps_attendance_backend.models.Units;
import com.example.gps_attendance_backend.respositories.UnitRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class UnitService {
    @Autowired
    private UnitRepository unitRepository;

    public List<Units> getAllUnits() {
        return unitRepository.findAll();
    }



    public Units addUnit(Units unit){
        if (unit.getUnitCode() == null || unit.getUnitName() == null) {
            throw new IllegalArgumentException("Unit code and name cannot be null");
        }

        if (unit.getCourseCode() == null ||unit.getYear()== 0|| unit.getSemester() == 0){
            throw new RuntimeException("Course code, year and semester cannot be null");
        }


//        if (unit.getLatitude() == null || unit.getLongitude() == null) {
//            throw new IllegalArgumentException("Latitude and longitude cannot be null");
//        }
//        if (LocalDateTime.now().isBefore(unit.getStartTime()) || LocalDateTime.now().isAfter(unit.getEndTime())) {
//            unit.setActive(false);
//        }

        return unitRepository.save(unit);
    }

    public Units getUnit(String unitCode){
        return unitRepository.findByUnitCode(unitCode)
                .orElseThrow(()-> new RuntimeException("Course not found with code: " + unitCode));
    }


}
