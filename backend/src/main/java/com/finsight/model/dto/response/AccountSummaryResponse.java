package com.finsight.model.dto.response;

import com.finsight.model.enums.AccountType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AccountSummaryResponse {

    private String accountNumber;
    private AccountType type;
    private BigDecimal balance;
    private String formattedBalance;
}
