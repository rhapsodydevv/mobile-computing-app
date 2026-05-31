package com.example.gps_attendance_backend.services;

import com.example.gps_attendance_backend.models.Users;
import com.example.gps_attendance_backend.respositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.parameters.P;
import org.springframework.stereotype.Service;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    public Users signUp(Users user){
        if (user.getEmail() ==null || user.getRegistrationNumber()==null){
            throw new RuntimeException("Email and registration number cannot be empty");
        }

        if(userRepository.existsByEmail(user.getEmail())){
            throw new RuntimeException("User with this email already exists");
        }

        if(userRepository.existsByRegistrationNumber(user.getRegistrationNumber())){
            throw new RuntimeException("User with this registration number already exists");
        }

        return userRepository.save(user);
    }

//    public Users login(Users user){
//        if(userRepository.existsByEmail(user.getEmail())){
//            throw new RuntimeException("User with this email does not exist");
//        }
//
////        if(userRepository.existsByRegistrationNumber(user.getRegistrationNumber())){
////            throw new RuntimeException("User with this registration number already exists");
////        }
//
//        return userRepository.save(user);
//    }
}
