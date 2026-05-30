package com.pos.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;
import java.math.BigDecimal;

@Data
public class ProductRequest {
    @NotBlank  private String name;
               private String barcode;
               private String description;
               private String imageUrl;
    @NotNull @Positive private BigDecimal price;
               private BigDecimal costPrice = BigDecimal.ZERO;
               private Long categoryId;
               private Long supplierId;
}
