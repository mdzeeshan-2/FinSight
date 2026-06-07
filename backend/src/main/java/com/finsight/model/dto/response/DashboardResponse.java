package com.finsight.model.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardResponse {

    private BigDecimal totalBalance;
    private String formattedTotalBalance;
    private int totalAccounts;
    private BigDecimal monthlyIncome;
    private String formattedMonthlyIncome;
    private BigDecimal monthlyExpenses;
    private String formattedMonthlyExpenses;
    private List<TransactionResponse> recentTransactions;
    private List<AccountSummaryResponse> accountSummaries;
    private List<MonthlySpendingResponse> spendingData;
}
