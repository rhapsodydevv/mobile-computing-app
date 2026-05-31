package com.example.gps_attendance_backend.models;

import lombok.Data;

@Data
public class ApiResponse<T> {
    private int status;

    public ApiResponse(int status, String message, T data) {
        this.status = status;
        this.message = message;
        this.data = data;
    }

    private String message;
    private T data;
}
