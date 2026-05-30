package com.pos.controller;

import com.pos.dto.request.StockAdjustRequest;
import com.pos.dto.response.StockResponse;
import com.pos.repository.StockRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/stock")
@RequiredArgsConstructor
public class StockController {

    private final StockRepository stockRepository;

    @GetMapping
    public List<StockResponse> list() {
        return stockRepository.findAll().stream().map(StockResponse::from).collect(Collectors.toList());
    }

    @GetMapping("/low")
    public List<StockResponse> lowStock() {
        return stockRepository.findLowStock().stream().map(StockResponse::from).collect(Collectors.toList());
    }

    @PatchMapping("/{productId}/adjust")
    public ResponseEntity<StockResponse> adjust(@PathVariable Long productId,
                                                @RequestBody StockAdjustRequest req) {
        if (!stockRepository.findByProductId(productId).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        var stock = stockRepository.findByProductId(productId).get();
        stock.setQuantity(stock.getQuantity() + req.getQuantity());
        return ResponseEntity.ok(StockResponse.from(stockRepository.save(stock)));
    }
}
