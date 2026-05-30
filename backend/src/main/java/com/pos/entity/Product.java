package com.pos.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data @Entity @Table(name = "products")
public class Product {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @Column(length = 50, unique = true)  private String barcode;
    @Column(nullable = false, length = 200) private String name;
    private String description;
    @Column(nullable = false, precision = 12, scale = 2)    private BigDecimal price;
    @Column(name = "cost_price", nullable = false, precision = 12, scale = 2) private BigDecimal costPrice = BigDecimal.ZERO;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "category_id") @JsonIgnore private Category category;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "supplier_id") @JsonIgnore private Supplier supplier;
    @Column(name = "image_url", length = 500) private String imageUrl;
    @Column(name = "is_active", nullable = false) private Boolean isActive = true;
    @OneToOne(mappedBy = "product", cascade = CascadeType.ALL, fetch = FetchType.LAZY) @JsonIgnore private Stock stock;
    @Column(name = "created_at", nullable = false, updatable = false) private LocalDateTime createdAt = LocalDateTime.now();
    @Column(name = "updated_at", nullable = false) private LocalDateTime updatedAt = LocalDateTime.now();

    @PreUpdate public void preUpdate() { updatedAt = LocalDateTime.now(); }
}
