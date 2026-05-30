package com.pos.controller;

import com.pos.dto.request.CreateOrderRequest;
import com.pos.dto.response.OrderResponse;
import com.pos.entity.*;
import com.pos.repository.*;
import com.pos.security.JwtUtil;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderRepository   orderRepository;
    private final ProductRepository productRepository;
    private final StockRepository   stockRepository;
    private final UserRepository    userRepository;
    private final JwtUtil           jwtUtil;

    @GetMapping
    public ResponseEntity<Page<OrderResponse>> list(
            @RequestParam(defaultValue = "0")  int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false)    String status) {
        var pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Order> result = (status != null)
                ? orderRepository.findByStatus(status, pageable)
                : orderRepository.findAll(pageable);
        return ResponseEntity.ok(result.map(OrderResponse::from));
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrderResponse> get(@PathVariable Long id) {
        Optional<Order> opt = orderRepository.findById(id);
        if (opt.isEmpty()) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(OrderResponse.from(opt.get()));
    }

    @PostMapping
    public ResponseEntity<?> create(@Valid @RequestBody CreateOrderRequest req,
                                    @RequestHeader("Authorization") String authHeader) {
        String username = jwtUtil.extractUsername(authHeader.substring(7));
        Optional<User> userOpt = userRepository.findByUsername(username);
        if (userOpt.isEmpty()) return ResponseEntity.status(401).body(Map.of("message", "Unauthorized"));

        Order order = new Order();
        order.setUser(userOpt.get());
        order.setOrderNumber("ORD-" + System.currentTimeMillis());
        order.setStatus("COMPLETED");
        order.setNote(req.getNote());
        order.setItems(new ArrayList<>());
        order.setPayments(new ArrayList<>());

        BigDecimal subtotal = BigDecimal.ZERO;

        for (var itemReq : req.getItems()) {
            Optional<Product> productOpt = productRepository.findById(itemReq.getProductId());
            if (productOpt.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("message", "ไม่พบสินค้า ID: " + itemReq.getProductId()));
            }
            Product product = productOpt.get();

            Optional<Stock> stockOpt = stockRepository.findByProductId(itemReq.getProductId());
            if (stockOpt.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("message", "ไม่พบข้อมูลสต็อก: " + product.getName()));
            }
            Stock stock = stockOpt.get();

            if (stock.getQuantity() < itemReq.getQuantity()) {
                return ResponseEntity.badRequest().body(Map.of(
                        "message", "สินค้า \"" + product.getName() + "\" มีไม่เพียงพอ (คงเหลือ " + stock.getQuantity() + ")"));
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

        return ResponseEntity.ok(OrderResponse.from(orderRepository.save(order)));
    }

    @GetMapping("/summary/today")
    public ResponseEntity<?> todaySummary() {
        LocalDateTime start = LocalDate.now().atStartOfDay();
        LocalDateTime end   = start.plusDays(1);
        return ResponseEntity.ok(Map.of(
                "count", orderRepository.countByDateRange(start, end),
                "total", orderRepository.sumTotalByDateRange(start, end)));
    }
}
