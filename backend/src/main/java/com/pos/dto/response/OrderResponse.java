package com.pos.dto.response;

import com.pos.entity.Order;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Data
public class OrderResponse {
    private Long                    id;
    private String                  orderNumber;
    private String                  status;
    private BigDecimal              subtotal;
    private BigDecimal              discount;
    private BigDecimal              tax;
    private BigDecimal              total;
    private String                  note;
    private Long                    userId;
    private String                  userName;
    private Long                    customerId;
    private String                  customerName;
    private String                  paymentMethod;
    private List<OrderItemResponse> items;
    private LocalDateTime           createdAt;

    public static OrderResponse from(Order o) {
        OrderResponse r = new OrderResponse();
        r.setId(o.getId());
        r.setOrderNumber(o.getOrderNumber());
        r.setStatus(o.getStatus());
        r.setSubtotal(o.getSubtotal());
        r.setDiscount(o.getDiscount());
        r.setTax(o.getTax());
        r.setTotal(o.getTotal());
        r.setNote(o.getNote());
        r.setCreatedAt(o.getCreatedAt());
        if (o.getUser()     != null) { r.setUserId(o.getUser().getId()); r.setUserName(o.getUser().getFullName()); }
        if (o.getCustomer() != null) { r.setCustomerId(o.getCustomer().getId()); r.setCustomerName(o.getCustomer().getName()); }
        if (o.getPayments() != null && !o.getPayments().isEmpty()) r.setPaymentMethod(o.getPayments().get(0).getMethod());
        r.setItems(o.getItems() == null ? Collections.emptyList()
                : o.getItems().stream().map(OrderItemResponse::from).collect(Collectors.toList()));
        return r;
    }
}
