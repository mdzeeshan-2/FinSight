package com.finsight.service;

import com.finsight.model.dto.response.AccountSummaryResponse;
import com.finsight.model.dto.response.DashboardResponse;
import com.finsight.model.dto.response.MonthlySpendingResponse;
import com.finsight.model.dto.response.TransactionResponse;
import com.finsight.model.entity.Account;
import com.finsight.model.entity.Transaction;
import com.finsight.model.enums.TransactionType;
import com.finsight.repository.AccountRepository;
import com.finsight.repository.TransactionRepository;
import com.finsight.security.SecurityUtils;
import com.finsight.util.CurrencyUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.time.format.TextStyle;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private static final List<TransactionType> INCOME_TYPES = List.of(
            TransactionType.DEPOSIT,
            TransactionType.TRANSFER_IN
    );

    private static final List<TransactionType> EXPENSE_TYPES = List.of(
            TransactionType.WITHDRAWAL,
            TransactionType.TRANSFER_OUT
    );

    private final AccountRepository accountRepository;
    private final TransactionRepository transactionRepository;
    private final SecurityUtils securityUtils;

    public DashboardResponse getDashboard() {
        UUID userId = securityUtils.getCurrentUserId();
        List<Account> accounts = accountRepository.findByUserIdOrderByCreatedAtDesc(userId);
        List<UUID> accountIds = accounts.stream().map(Account::getId).toList();

        BigDecimal totalBalance = accounts.stream()
                .map(Account::getBalance)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        YearMonth currentMonth = YearMonth.now();
        LocalDateTime monthStart = currentMonth.atDay(1).atStartOfDay();
        LocalDateTime monthEnd = currentMonth.plusMonths(1).atDay(1).atStartOfDay();

        BigDecimal monthlyIncome = accountIds.isEmpty()
                ? BigDecimal.ZERO
                : transactionRepository.sumAmountByAccountIdsAndTypesAndDateRange(
                        accountIds, INCOME_TYPES, monthStart, monthEnd);

        BigDecimal monthlyExpenses = accountIds.isEmpty()
                ? BigDecimal.ZERO
                : transactionRepository.sumAmountByAccountIdsAndTypesAndDateRange(
                        accountIds, EXPENSE_TYPES, monthStart, monthEnd);

        List<TransactionResponse> recentTransactions = accountIds.isEmpty()
                ? List.of()
                : transactionRepository.findRecentByAccountIds(accountIds, PageRequest.of(0, 5))
                        .stream()
                        .map(this::toTransactionResponse)
                        .toList();

        List<AccountSummaryResponse> accountSummaries = accounts.stream()
                .map(account -> AccountSummaryResponse.builder()
                        .accountNumber(account.getAccountNumber())
                        .type(account.getType())
                        .balance(account.getBalance())
                        .formattedBalance(CurrencyUtil.formatIndianRupee(account.getBalance()))
                        .build())
                .toList();

        List<MonthlySpendingResponse> spendingData = buildSpendingData(accountIds);

        return DashboardResponse.builder()
                .totalBalance(totalBalance)
                .formattedTotalBalance(CurrencyUtil.formatIndianRupee(totalBalance))
                .totalAccounts(accounts.size())
                .monthlyIncome(monthlyIncome)
                .formattedMonthlyIncome(CurrencyUtil.formatIndianRupee(monthlyIncome))
                .monthlyExpenses(monthlyExpenses)
                .formattedMonthlyExpenses(CurrencyUtil.formatIndianRupee(monthlyExpenses))
                .recentTransactions(recentTransactions)
                .accountSummaries(accountSummaries)
                .spendingData(spendingData)
                .build();
    }

    private List<MonthlySpendingResponse> buildSpendingData(List<UUID> accountIds) {
        List<MonthlySpendingResponse> spendingData = new ArrayList<>();

        for (int i = 5; i >= 0; i--) {
            YearMonth month = YearMonth.now().minusMonths(i);
            LocalDateTime start = month.atDay(1).atStartOfDay();
            LocalDateTime end = month.plusMonths(1).atDay(1).atStartOfDay();

            BigDecimal income = accountIds.isEmpty()
                    ? BigDecimal.ZERO
                    : transactionRepository.sumByMonth(accountIds, INCOME_TYPES, start, end);

            BigDecimal expenses = accountIds.isEmpty()
                    ? BigDecimal.ZERO
                    : transactionRepository.sumByMonth(accountIds, EXPENSE_TYPES, start, end);

            String monthLabel = month.getMonth().getDisplayName(TextStyle.SHORT, Locale.ENGLISH);

            spendingData.add(MonthlySpendingResponse.builder()
                    .month(monthLabel)
                    .income(income)
                    .expenses(expenses)
                    .build());
        }

        return spendingData;
    }

    private TransactionResponse toTransactionResponse(Transaction transaction) {
        return TransactionResponse.builder()
                .id(transaction.getId())
                .accountId(transaction.getAccountId())
                .type(transaction.getType())
                .amount(transaction.getAmount())
                .formattedAmount(CurrencyUtil.formatIndianRupee(transaction.getAmount()))
                .description(transaction.getDescription())
                .balanceAfter(transaction.getBalanceAfter())
                .formattedBalanceAfter(CurrencyUtil.formatIndianRupee(transaction.getBalanceAfter()))
                .createdAt(transaction.getCreatedAt())
                .build();
    }
}
