package com.pos.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import javax.crypto.SecretKey;
import java.util.Date;

@Component
public class JwtUtil {

    @Value("${app.jwt.secret}")   private String secret;
    @Value("${app.jwt.expiration-ms}") private long expirationMs;

    private SecretKey getKey() { return Keys.hmacShaKeyFor(secret.getBytes()); }

    public String generateToken(String username, String role) {
        return Jwts.builder()
                .subject(username).claim("role", role)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + expirationMs))
                .signWith(getKey()).compact();
    }

    public String extractUsername(String token) { return getClaims(token).getSubject(); }

    public boolean validateToken(String token) {
        try { getClaims(token); return true; }
        catch (JwtException | IllegalArgumentException e) { return false; }
    }

    private Claims getClaims(String token) {
        return Jwts.parser().verifyWith(getKey()).build()
                .parseSignedClaims(token).getPayload();
    }
}
