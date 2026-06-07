package com.finsight.model.dto.response;

import com.finsight.model.enums.AccountType;
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
public class AccountResponse {

    private UUID id;
    private UUID userId;
    private String accountNumber;
    private AccountType type;
    private BigDecimal balance;
    private String formattedBalance;
    private LocalDateTime createdAt;
}
