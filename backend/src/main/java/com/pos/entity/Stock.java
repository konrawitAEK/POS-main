package com.pos.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data @Entity @Table(name = "stock")
public class Stock {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @OneToOne(fetch = FetchType.LAZY) @JoinColumn(name = "product_id", nullable = false, unique = true) @JsonIgnore private Product product;
    @Column(nullable = false) private Integer quantity = 0;
    @Column(name = "min_quantity", nullable = false) private Integer minQuantity = 5;
    @Column(name = "max_quantity", nullable = false) private Integer maxQuantity = 500;
    @Column(name = "last_updated", nullable = false) private LocalDateTime lastUpdated = LocalDateTime.now();

    @PreUpdate public void preUpdate() { lastUpdated = LocalDateTime.now(); }
}
