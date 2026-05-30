package com.pos.repository;

import com.pos.entity.Order;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public interface OrderRepository extends JpaRepository<Order, Long> {
    Page<Order> findByStatus(String status, Pageable pageable);

    @Query("SELECT COUNT(o) FROM Order o WHERE o.createdAt BETWEEN :from AND :to AND o.status = 'COMPLETED'")
    long countByDateRange(@Param("from") LocalDateTime from, @Param("to") LocalDateTime to);

    @Query("SELECT COALESCE(SUM(o.total),0) FROM Order o WHERE o.createdAt BETWEEN :from AND :to AND o.status = 'COMPLETED'")
    BigDecimal sumTotalByDateRange(@Param("from") LocalDateTime from, @Param("to") LocalDateTime to);
}
