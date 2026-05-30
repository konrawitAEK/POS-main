package com.pos.dto.response;

import com.pos.entity.Stock;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class StockResponse {
    private Long          id;
    private Long          productId;
    private String        productName;
    private String        productBarcode;
    private Integer       quantity;
    private Integer       minQuantity;
    private Integer       maxQuantity;
    private boolean       lowStock;
    private LocalDateTime lastUpdated;

    public static StockResponse from(Stock s) {
        StockResponse r = new StockResponse();
        r.setId(s.getId());
        r.setQuantity(s.getQuantity());
        r.setMinQuantity(s.getMinQuantity());
        r.setMaxQuantity(s.getMaxQuantity());
        r.setLastUpdated(s.getLastUpdated());
        r.setLowStock(s.getQuantity() <= s.getMinQuantity());
        if (s.getProduct() != null) {
            r.setProductId(s.getProduct().getId());
            r.setProductName(s.getProduct().getName());
            r.setProductBarcode(s.getProduct().getBarcode());
        }
        return r;
    }
}
