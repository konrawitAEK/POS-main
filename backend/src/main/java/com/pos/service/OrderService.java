package com.pos.service;

import com.pos.dto.request.CreateOrderRequest;
import com.pos.dto.response.OrderResponse;
import com.pos.dto.response.TodaySummaryResponse;
import com.pos.entity.*;
import com.pos.repository.*;
import com.pos.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository   orderRepository;
    private final ProductRepository productRepository;
    private final StockRepository   stockRepository;
    private final UserRepository    userRepository;
    private final JwtUtil           jwtUtil;

    public Page<OrderResponse> list(int page, int size, String status) {
        var pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Order> result = (status != null)
                ? orderRepository.findByStatus(status, pageable)
                : orderRepository.findAll(pageable);
        return result.map(OrderResponse::from);
    }

    public OrderResponse get(Long id) {
        return orderRepository.findById(id)
                .map(OrderResponse::from)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
    }

    public OrderResponse create(CreateOrderRequest req, String authHeader) {
        String username = jwtUtil.extractUsername(authHeader.substring(7));
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Unauthorized"));

        Order order = new Order();
        order.setUser(user);
        order.setOrderNumber("ORD-" + System.currentTimeMillis());
        order.setStatus("COMPLETED");
        order.setNote(req.getNote());
        order.setItems(new ArrayList<>());
        order.setPayments(new ArrayList<>());

        BigDecimal subtotal = BigDecimal.ZERO;

        for (var itemReq : req.getItems()) {
            Product product = productRepository.findById(itemReq.getProductId())
                    .orElseThrow(() -> new ResponseStatusException(
                            HttpStatus.BAD_REQUEST, "ไม่พบสินค้า ID: " + itemReq.getProductId()));

            Stock stock = stockRepository.findByProductId(itemReq.getProductId())
                    .orElseThrow(() -> new ResponseStatusException(
                            HttpStatus.BAD_REQUEST, "ไม่พบข้อมูลสต็อก: " + product.getName()));

            if (stock.getQuantity() < itemReq.getQuantity()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                        "สินค้า \"" + product.getName() + "\" มีไม่เพียงพอ (คงเหลือ " + stock.getQuantity() + ")");
            }

            stock.setQuantity(stock.getQuantity() - itemReq.getQuantity());
            stockRepository.save(stock);

            BigDecimal lineTotal = product.getPrice().multiply(BigDecimal.valueOf(itemReq.getQuantity()));
            subtotal = subtotal.add(lineTotal);

            OrderItem oi = new OrderItem();
            oi.setOrder(order);
            oi.setProduct(product);
            oi.setQuantity(itemReq.getQuantity());
            oi.setUnitPrice(product.getPrice());
            oi.setSubtotal(lineTotal);
            order.getItems().add(oi);
        }

        order.setSubtotal(subtotal);
        order.setTotal(subtotal);

        Payment payment = new Payment();
        payment.setOrder(order);
        payment.setMethod(req.getPaymentMethod());
        payment.setAmount(subtotal);
        order.getPayments().add(payment);

        return OrderResponse.from(orderRepository.save(order));
    }

    public TodaySummaryResponse todaySummary() {
        LocalDateTime start = LocalDate.now().atStartOfDay();
        LocalDateTime end   = start.plusDays(1);
        return new TodaySummaryResponse(
                orderRepository.countByDateRange(start, end),
                orderRepository.sumTotalByDateRange(start, end));
    }
}
