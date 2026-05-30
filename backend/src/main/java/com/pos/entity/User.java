package com.pos.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data @Entity @Table(name = "users")
public class User {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @Column(nullable = false, unique = true, length = 50)   private String username;
    @Column(nullable = false)                               private String password;
    @Column(name = "full_name", nullable = false, length = 100) private String fullName;
    @Column(nullable = false, length = 20)                  private String role = "CASHIER";
    @Column(length = 100, unique = true)                    private String email;
    @Column(length = 20)                                    private String phone;
    @Column(name = "is_active", nullable = false)           private Boolean isActive = true;
    @Column(name = "created_at", nullable = false, updatable = false) private LocalDateTime createdAt = LocalDateTime.now();
    @Column(name = "updated_at", nullable = false)          private LocalDateTime updatedAt = LocalDateTime.now();

    @PreUpdate public void preUpdate() { updatedAt = LocalDateTime.now(); }
}
