package com.pos.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data @Entity @Table(name = "orders")
public class Order {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @Column(name = "order_number", nullable = false, unique = true, length = 50) private String orderNumber;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "customer_id") @JsonIgnore private Customer customer;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "user_id", nullable = false) @JsonIgnore private User user;
    @Column(nullable = false, length = 20) private String status = "PENDING";
    @Column(nullable = false, precision = 12, scale = 2) private BigDecimal subtotal = BigDecimal.ZERO;
    @Column(nullable = false, precision = 12, scale = 2) private BigDecimal discount = BigDecimal.ZERO;
    @Column(nullable = false, precision = 12, scale = 2) private BigDecimal tax = BigDecimal.ZERO;
    @Column(nullable = false, precision = 12, scale = 2) private BigDecimal total = BigDecimal.ZERO;
    private String note;
    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, fetch = FetchType.LAZY) @JsonIgnore private List<OrderItem> items;
    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, fetch = FetchType.LAZY) @JsonIgnore private List<Payment> payments;
    @Column(name = "created_at", nullable = false, updatable = false) private LocalDateTime createdAt = LocalDateTime.now();
    @Column(name = "updated_at", nullable = false) private LocalDateTime updatedAt = LocalDateTime.now();

    @PreUpdate public void preUpdate() { updatedAt = LocalDateTime.now(); }
}
