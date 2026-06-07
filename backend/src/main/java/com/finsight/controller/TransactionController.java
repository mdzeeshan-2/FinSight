package com.finsight.controller;

import com.finsight.model.dto.request.DepositRequest;
import com.finsight.model.dto.request.TransferRequest;
import com.finsight.model.dto.request.WithdrawRequest;
import com.finsight.model.dto.response.ApiResponse;
import com.finsight.model.dto.response.TransactionResponse;
import com.finsight.service.TransactionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/transactions")
@RequiredArgsConstructor
public class TransactionController {

    private final TransactionService transactionService;

    @PostMapping("/deposit")
    public ResponseEntity<ApiResponse<TransactionResponse>> deposit(@Valid @RequestBody DepositRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Deposit successful", transactionService.deposit(request)));
    }

    @PostMapping("/withdraw")
    public ResponseEntity<ApiResponse<TransactionResponse>> withdraw(@Valid @RequestBody WithdrawRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Withdrawal successful", transactionService.withdraw(request)));
    }

    @PostMapping("/transfer")
    public ResponseEntity<ApiResponse<TransactionResponse>> transfer(@Valid @RequestBody TransferRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Transfer successful", transactionService.transfer(request)));
    }

    @GetMapping("/{accountId}")
    public ResponseEntity<ApiResponse<Page<TransactionResponse>>> getTransactions(
            @PathVariable UUID accountId,
            @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable
    ) {
        return ResponseEntity.ok(ApiResponse.success(transactionService.getAccountTransactions(accountId, pageable)));
    }
}
