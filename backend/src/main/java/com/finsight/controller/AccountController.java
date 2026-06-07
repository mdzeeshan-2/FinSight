package com.finsight.controller;

import com.finsight.model.dto.request.CreateAccountRequest;
import com.finsight.model.dto.response.AccountResponse;
import com.finsight.model.dto.response.ApiResponse;
import com.finsight.model.dto.response.BalanceResponse;
import com.finsight.service.AccountService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/accounts")
@RequiredArgsConstructor
public class AccountController {

    private final AccountService accountService;

    @PostMapping
    public ResponseEntity<ApiResponse<AccountResponse>> createAccount(
            @Valid @RequestBody CreateAccountRequest request
    ) {
        return ResponseEntity.ok(ApiResponse.success("Account created", accountService.createAccount(request)));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<AccountResponse>>> getAccounts() {
        return ResponseEntity.ok(ApiResponse.success(accountService.getUserAccounts()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<AccountResponse>> getAccount(@PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponse.success(accountService.getAccountById(id)));
    }

    @GetMapping("/{id}/balance")
    public ResponseEntity<ApiResponse<BalanceResponse>> getBalance(@PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponse.success(accountService.getAccountBalance(id)));
    }
}
