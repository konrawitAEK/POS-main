package com.pos.dto.response;

import com.pos.entity.OrderItem;
import lombok.Data;
import java.math.BigDecimal;

@Data
public class OrderItemResponse {
    private Long       id;
    private Long       productId;
    private String     productName;
    private Integer    quantity;
    private BigDecimal unitPrice;
    private BigDecimal discount;
    private BigDecimal subtotal;

    public static OrderItemResponse from(OrderItem i) {
        OrderItemResponse r = new OrderItemResponse();
        r.setId(i.getId());
        r.setQuantity(i.getQuantity());
        r.setUnitPrice(i.getUnitPrice());
        r.setDiscount(i.getDiscount());
        r.setSubtotal(i.getSubtotal());
        if (i.getProduct() != null) { r.setProductId(i.getProduct().getId()); r.setProductName(i.getProduct().getName()); }
        return r;
    }
}
