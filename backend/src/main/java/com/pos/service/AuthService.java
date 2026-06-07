package com.pos.service;

import com.pos.dto.request.LoginRequest;
import com.pos.dto.response.LoginResponse;
import com.pos.dto.response.MeResponse;
import com.pos.entity.User;
import com.pos.repository.UserRepository;
import com.pos.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository  userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil         jwtUtil;

    public LoginResponse login(LoginRequest req) {
        User u = userRepository.findByUsername(req.getUsername())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "ไม่พบ username"));

        if (!Boolean.TRUE.equals(u.getIsActive())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "user ถูกปิดใช้งาน");
        }

        if (!passwordEncoder.matches(req.getPassword(), u.getPassword())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "password ไม่ถูกต้อง");
        }

        return new LoginResponse(
                jwtUtil.generateToken(u.getUsername(), u.getRole()),
                u.getUsername(),
                u.getFullName(),
                u.getRole()
        );
    }

    public MeResponse me(String authHeader) {
        String username = jwtUtil.extractUsername(authHeader.substring(7));
        User u = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "ไม่พบ user"));

        return new MeResponse(
                u.getId(),
                u.getUsername(),
                u.getFullName(),
                u.getRole(),
                u.getEmail() != null ? u.getEmail() : ""
        );
    }
}
