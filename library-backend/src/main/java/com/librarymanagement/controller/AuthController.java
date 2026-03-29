package com.librarymanagement.controller;

import com.librarymanagement.config.JwtUtil;
import com.librarymanagement.dto.ApiResponse;
import com.librarymanagement.dto.UserDTO;
import com.librarymanagement.entity.User;
import com.librarymanagement.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.*;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UserService userService;
    private final JwtUtil jwtUtil;

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<UserDTO.LoginResponse>> login(
            @Valid @RequestBody UserDTO.LoginRequest request) {

        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getEmail(),
                            request.getPassword()
                    )
            );
        } catch (BadCredentialsException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error("Invalid email or password"));
        }

        UserDetails userDetails = userService.loadUserByUsername(request.getEmail());
        String token = jwtUtil.generateToken(userDetails);
        User user = userService.findByEmail(request.getEmail());

        UserDTO.LoginResponse response = UserDTO.LoginResponse.builder()
                .token(token)
                .type("Bearer")
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole().name())
                .build();

        return ResponseEntity.ok(ApiResponse.success("Login successful", response));
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<UserDTO.Response>> register(
            @Valid @RequestBody UserDTO.RegisterRequest request) {

        request.setRole(User.Role.MEMBER);
        UserDTO.Response response = userService.registerUser(request);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Registration successful", response));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserDTO.Response>> getCurrentUser() {

        String email = ((org.springframework.security.core.userdetails.User)
                org.springframework.security.core.context.SecurityContextHolder
                        .getContext().getAuthentication().getPrincipal())
                .getUsername();

        User user = userService.findByEmail(email);

        return ResponseEntity.ok(
                ApiResponse.success("User fetched", UserDTO.Response.fromEntity(user))
        );
    }
}