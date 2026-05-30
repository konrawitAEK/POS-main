package com.pos.repository;

import com.pos.entity.Stock;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;
import java.util.Optional;

public interface StockRepository extends JpaRepository<Stock, Long> {
    Optional<Stock> findByProductId(Long productId);

    @Query("SELECT s FROM Stock s WHERE s.quantity <= s.minQuantity")
    List<Stock> findLowStock();
}
