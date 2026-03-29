package com.librarymanagement.dto;

import com.librarymanagement.entity.User;
import lombok.*;
import jakarta.validation.constraints.*;

import java.time.LocalDateTime;

public class UserDTO {

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class RegisterRequest {

        @NotBlank(message = "Name is required")
        @Size(max = 100)
        private String name;

        @NotBlank(message = "Email is required")
        @Email(message = "Valid email is required")
        private String email;

        @NotBlank(message = "Password is required")
        @Size(min = 6, message = "Password must be at least 6 characters")
        private String password;

        private String phone;
        private String address;
        private User.Role role = User.Role.MEMBER;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class LoginRequest {

        @NotBlank(message = "Email is required")
        @Email
        private String email;

        @NotBlank(message = "Password is required")
        private String password;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class LoginResponse {

        private String token;
        private String type = "Bearer";
        private String id;
        private String name;
        private String email;
        private String role;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Response {

        private String id;
        private String name;
        private String email;
        private String role;
        private String phone;
        private String address;
        private boolean active;
        private LocalDateTime createdAt;

        public static Response fromEntity(User user) {

            if (user == null) return null;

            return Response.builder()
                    .id(user.getId())
                    .name(user.getName())
                    .email(user.getEmail())
                    .role(user.getRole() != null ? user.getRole().name() : null)
                    .phone(user.getPhone())
                    .address(user.getAddress())
                    .active(user.isActive())
                    .createdAt(user.getCreatedAt())
                    .build();
        }
    }
}