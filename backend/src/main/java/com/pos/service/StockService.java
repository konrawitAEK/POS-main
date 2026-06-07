package com.pos.service;

import com.pos.dto.request.StockAdjustRequest;
import com.pos.dto.response.StockResponse;
import com.pos.repository.StockRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StockService {

    private final StockRepository stockRepository;

    public List<StockResponse> list() {
        return stockRepository.findAll().stream().map(StockResponse::from).collect(Collectors.toList());
    }

    public List<StockResponse> lowStock() {
        return stockRepository.findLowStock().stream().map(StockResponse::from).collect(Collectors.toList());
    }

    public StockResponse adjust(Long productId, StockAdjustRequest req) {
        var stock = stockRepository.findByProductId(productId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        stock.setQuantity(stock.getQuantity() + req.getQuantity());
        return StockResponse.from(stockRepository.save(stock));
    }
}
