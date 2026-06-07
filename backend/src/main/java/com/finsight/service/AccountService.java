package com.finsight.service;

import com.finsight.exception.ForbiddenException;
import com.finsight.exception.ResourceNotFoundException;
import com.finsight.model.dto.request.CreateAccountRequest;
import com.finsight.model.dto.response.AccountResponse;
import com.finsight.model.dto.response.BalanceResponse;
import com.finsight.model.entity.Account;
import com.finsight.repository.AccountRepository;
import com.finsight.security.SecurityUtils;
import com.finsight.util.CurrencyUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AccountService {

    private final AccountRepository accountRepository;
    private final SecurityUtils securityUtils;

    @Transactional
    public AccountResponse createAccount(CreateAccountRequest request) {
        UUID userId = securityUtils.getCurrentUserId();
        String accountNumber = generateUniqueAccountNumber();

        Account account = Account.builder()
                .userId(userId)
                .accountNumber(accountNumber)
                .type(request.getType())
                .balance(BigDecimal.ZERO)
                .build();

        return toAccountResponse(accountRepository.save(account));
    }

    public List<AccountResponse> getUserAccounts() {
        UUID userId = securityUtils.getCurrentUserId();
        return accountRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(this::toAccountResponse)
                .toList();
    }

    public AccountResponse getAccountById(UUID accountId) {
        Account account = getOwnedAccount(accountId);
        return toAccountResponse(account);
    }

    public BalanceResponse getAccountBalance(UUID accountId) {
        Account account = getOwnedAccount(accountId);
        return BalanceResponse.builder()
                .accountId(account.getId())
                .balance(account.getBalance())
                .formattedBalance(CurrencyUtil.formatIndianRupee(account.getBalance()))
                .lastUpdated(java.time.LocalDateTime.now())
                .build();
    }

    public Account getOwnedAccount(UUID accountId) {
        UUID userId = securityUtils.getCurrentUserId();
        return accountRepository.findByIdAndUserId(accountId, userId)
                .orElseThrow(() -> new ForbiddenException("You do not have access to this account"));
    }

    public Account getAccountByNumber(String accountNumber) {
        return accountRepository.findByAccountNumber(accountNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Account not found: " + accountNumber));
    }

    private String generateUniqueAccountNumber() {
        String accountNumber;
        do {
            accountNumber = CurrencyUtil.generateAccountNumberFromTimestamp();
        } while (accountRepository.existsByAccountNumber(accountNumber));
        return accountNumber;
    }

    private AccountResponse toAccountResponse(Account account) {
        return AccountResponse.builder()
                .id(account.getId())
                .userId(account.getUserId())
                .accountNumber(account.getAccountNumber())
                .type(account.getType())
                .balance(account.getBalance())
                .formattedBalance(CurrencyUtil.formatIndianRupee(account.getBalance()))
                .createdAt(account.getCreatedAt())
                .build();
    }
}
