package com.finsight.service;

import com.finsight.exception.InsufficientFundsException;
import com.finsight.model.dto.request.DepositRequest;
import com.finsight.model.dto.request.TransferRequest;
import com.finsight.model.dto.request.WithdrawRequest;
import com.finsight.model.dto.response.TransactionResponse;
import com.finsight.model.entity.Account;
import com.finsight.model.entity.Transaction;
import com.finsight.model.enums.TransactionType;
import com.finsight.repository.AccountRepository;
import com.finsight.repository.TransactionRepository;
import com.finsight.util.CurrencyUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TransactionService {

    private final TransactionRepository transactionRepository;
    private final AccountRepository accountRepository;
    private final AccountService accountService;

    @Transactional
    public TransactionResponse deposit(DepositRequest request) {
        Account account = accountService.getOwnedAccount(request.getAccountId());
        account.setBalance(account.getBalance().add(request.getAmount()));
        accountRepository.save(account);

        Transaction transaction = Transaction.builder()
                .accountId(account.getId())
                .type(TransactionType.DEPOSIT)
                .amount(request.getAmount())
                .description(defaultDescription(request.getDescription(), "Deposit"))
                .balanceAfter(account.getBalance())
                .build();

        return toTransactionResponse(transactionRepository.save(transaction));
    }

    @Transactional
    public TransactionResponse withdraw(WithdrawRequest request) {
        Account account = accountService.getOwnedAccount(request.getAccountId());

        if (account.getBalance().compareTo(request.getAmount()) < 0) {
            throw new InsufficientFundsException("Insufficient balance for withdrawal");
        }

        account.setBalance(account.getBalance().subtract(request.getAmount()));
        accountRepository.save(account);

        Transaction transaction = Transaction.builder()
                .accountId(account.getId())
                .type(TransactionType.WITHDRAWAL)
                .amount(request.getAmount())
                .description(defaultDescription(request.getDescription(), "Withdrawal"))
                .balanceAfter(account.getBalance())
                .build();

        return toTransactionResponse(transactionRepository.save(transaction));
    }

    @Transactional
    public TransactionResponse transfer(TransferRequest request) {
        Account fromAccount = accountService.getOwnedAccount(request.getFromAccountId());
        Account toAccount = accountService.getAccountByNumber(request.getToAccountNumber());

        if (fromAccount.getId().equals(toAccount.getId())) {
            throw new IllegalArgumentException("Cannot transfer to the same account");
        }

        if (fromAccount.getBalance().compareTo(request.getAmount()) < 0) {
            throw new InsufficientFundsException("Insufficient balance for transfer");
        }

        fromAccount.setBalance(fromAccount.getBalance().subtract(request.getAmount()));
        toAccount.setBalance(toAccount.getBalance().add(request.getAmount()));
        accountRepository.save(fromAccount);
        accountRepository.save(toAccount);

        String description = defaultDescription(request.getDescription(), "Transfer");

        Transaction transferOut = Transaction.builder()
                .accountId(fromAccount.getId())
                .type(TransactionType.TRANSFER_OUT)
                .amount(request.getAmount())
                .description(description + " to " + toAccount.getAccountNumber())
                .balanceAfter(fromAccount.getBalance())
                .build();

        Transaction transferIn = Transaction.builder()
                .accountId(toAccount.getId())
                .type(TransactionType.TRANSFER_IN)
                .amount(request.getAmount())
                .description(description + " from " + fromAccount.getAccountNumber())
                .balanceAfter(toAccount.getBalance())
                .build();

        transactionRepository.save(transferIn);
        Transaction savedOut = transactionRepository.save(transferOut);

        return toTransactionResponse(savedOut);
    }

    public Page<TransactionResponse> getAccountTransactions(UUID accountId, Pageable pageable) {
        accountService.getOwnedAccount(accountId);
        return transactionRepository.findByAccountIdOrderByCreatedAtDesc(accountId, pageable)
                .map(this::toTransactionResponse);
    }

    private String defaultDescription(String description, String fallback) {
        return description == null || description.isBlank() ? fallback : description;
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
