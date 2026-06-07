package com.pos.controller;

import com.pos.dto.request.CreateOrderRequest;
import com.pos.dto.response.OrderResponse;
import com.pos.dto.response.TodaySummaryResponse;
import com.pos.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @GetMapping
    public ResponseEntity<Page<OrderResponse>> list(
            @RequestParam(defaultValue = "0")  int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false)    String status) {
        return ResponseEntity.ok(orderService.list(page, size, status));
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrderResponse> get(@PathVariable Long id) {
        return ResponseEntity.ok(orderService.get(id));
    }

    @PostMapping
    public ResponseEntity<OrderResponse> create(@Valid @RequestBody CreateOrderRequest req,
                                                @RequestHeader("Authorization") String authHeader) {
        return ResponseEntity.ok(orderService.create(req, authHeader));
    }

    @GetMapping("/summary/today")
    public ResponseEntity<TodaySummaryResponse> todaySummary() {
        return ResponseEntity.ok(orderService.todaySummary());
    }
}
