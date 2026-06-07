package com.finsight.model.dto.response;

import com.finsight.model.enums.TransactionType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TransactionResponse {

    private UUID id;
    private UUID accountId;
    private TransactionType type;
    private BigDecimal amount;
    private String formattedAmount;
    private String description;
    private BigDecimal balanceAfter;
    private String formattedBalanceAfter;
    private LocalDateTime createdAt;
}
