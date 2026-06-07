package com.pos.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import java.math.BigDecimal;

@Data @AllArgsConstructor
public class TodaySummaryResponse {
    private long       count;
    private BigDecimal total;
}
