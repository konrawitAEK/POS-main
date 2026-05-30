package com.pos.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data @Entity @Table(name = "payments")
public class Payment {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "order_id", nullable = false) @JsonIgnore private Order order;
    @Column(nullable = false, length = 30) private String method;
    @Column(nullable = false, precision = 12, scale = 2) private BigDecimal amount;
    @Column(name = "change_amount", nullable = false, precision = 12, scale = 2) private BigDecimal changeAmount = BigDecimal.ZERO;
    @Column(name = "reference_no", length = 100) private String referenceNo;
    @Column(name = "paid_at", nullable = false) private LocalDateTime paidAt = LocalDateTime.now();
}
