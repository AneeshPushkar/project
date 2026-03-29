package com.librarymanagement.service;

import com.librarymanagement.dto.UserDTO;
import com.librarymanagement.entity.User;
import com.librarymanagement.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService implements UserDetailsService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new UsernameNotFoundException("User not found with email: " + email));

        if (!user.isActive()) {
            throw new UsernameNotFoundException("User account is deactivated");
        }

        return new org.springframework.security.core.userdetails.User(
                user.getEmail(),
                user.getPassword(),
                Collections.singletonList(
                        new SimpleGrantedAuthority("ROLE_" + user.getRole().name())
                )
        );
    }

    @Transactional
    public UserDTO.Response registerUser(UserDTO.RegisterRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email already registered: " + request.getEmail());
        }

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole() != null ? request.getRole() : User.Role.MEMBER)
                .phone(request.getPhone())
                .address(request.getAddress())
                .active(true)
                .build();

        User saved = userRepository.save(user);

        return UserDTO.Response.fromEntity(saved);
    }

    public User findByEmail(String email) {

        return userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new UsernameNotFoundException("User not found: " + email));
    }

    public UserDTO.Response getUserById(String id) {

        User user = userRepository.findById(id)
                .orElseThrow(() ->
                        new IllegalArgumentException("User not found with id: " + id));

        return UserDTO.Response.fromEntity(user);
    }

    public Page<UserDTO.Response> getAllUsers(Pageable pageable) {

        return userRepository.findAll(pageable)
                .map(UserDTO.Response::fromEntity);
    }

    public Page<UserDTO.Response> searchUsers(String keyword, Pageable pageable) {

        return userRepository.searchUsers(keyword, pageable)
                .map(UserDTO.Response::fromEntity);
    }

    @Transactional
    public UserDTO.Response updateUser(String id, UserDTO.RegisterRequest request) {

        User user = userRepository.findById(id)
                .orElseThrow(() ->
                        new IllegalArgumentException("User not found: " + id));

        user.setName(request.getName());
        user.setPhone(request.getPhone());
        user.setAddress(request.getAddress());

        if (request.getPassword() != null && !request.getPassword().isBlank()) {
            user.setPassword(passwordEncoder.encode(request.getPassword()));
        }

        return UserDTO.Response.fromEntity(userRepository.save(user));
    }

    @Transactional
    public void toggleUserStatus(String id) {

        User user = userRepository.findById(id)
                .orElseThrow(() ->
                        new IllegalArgumentException("User not found: " + id));

        user.setActive(!user.isActive());
        userRepository.save(user);
    }

    public List<UserDTO.Response> getUsersByRole(User.Role role) {

        return userRepository.findByRole(role, Pageable.unpaged())
                .map(UserDTO.Response::fromEntity)
                .getContent();
    }
}