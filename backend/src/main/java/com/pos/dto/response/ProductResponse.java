package com.pos.dto.response;

import com.pos.entity.Product;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class ProductResponse {
    private Long          id;
    private String        barcode;
    private String        name;
    private String        description;
    private BigDecimal    price;
    private BigDecimal    costPrice;
    private String        imageUrl;
    private Boolean       isActive;
    private Long          categoryId;
    private String        categoryName;
    private Long          supplierId;
    private String        supplierName;
    private Integer       stockQuantity;
    private LocalDateTime createdAt;

    public static ProductResponse from(Product p) {
        ProductResponse r = new ProductResponse();
        r.setId(p.getId());
        r.setBarcode(p.getBarcode());
        r.setName(p.getName());
        r.setDescription(p.getDescription());
        r.setPrice(p.getPrice());
        r.setCostPrice(p.getCostPrice());
        r.setImageUrl(p.getImageUrl());
        r.setIsActive(p.getIsActive());
        r.setCreatedAt(p.getCreatedAt());
        if (p.getCategory() != null) { r.setCategoryId(p.getCategory().getId()); r.setCategoryName(p.getCategory().getName()); }
        if (p.getSupplier() != null) { r.setSupplierId(p.getSupplier().getId()); r.setSupplierName(p.getSupplier().getName()); }
        if (p.getStock()    != null) { r.setStockQuantity(p.getStock().getQuantity()); }
        return r;
    }
}
