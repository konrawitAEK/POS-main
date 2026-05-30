package com.pos.controller;

import com.pos.dto.request.LoginRequest;
import com.pos.dto.response.LoginResponse;
import com.pos.entity.User;
import com.pos.repository.UserRepository;
import com.pos.security.JwtUtil;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserRepository  userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil         jwtUtil;

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest req) {
        Optional<User> userOpt = userRepository.findByUsername(req.getUsername())
                .filter(u -> u.getIsActive() && passwordEncoder.matches(req.getPassword(), u.getPassword()));

        if (userOpt.isEmpty()) {
            return ResponseEntity.status(401).body(Map.of("message", "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง"));
        }

        User u = userOpt.get();
        return ResponseEntity.ok(new LoginResponse(
                jwtUtil.generateToken(u.getUsername(), u.getRole()),
                u.getUsername(), u.getFullName(), u.getRole()));
    }

    @GetMapping("/me")
    public ResponseEntity<?> me(@RequestHeader("Authorization") String authHeader) {
        String username = jwtUtil.extractUsername(authHeader.substring(7));
        Optional<User> userOpt = userRepository.findByUsername(username);

        if (userOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        User u = userOpt.get();
        return ResponseEntity.ok(Map.of(
                "id",       u.getId(),
                "username", u.getUsername(),
                "fullName", u.getFullName(),
                "role",     u.getRole(),
                "email",    u.getEmail() != null ? u.getEmail() : ""));
    }
}
