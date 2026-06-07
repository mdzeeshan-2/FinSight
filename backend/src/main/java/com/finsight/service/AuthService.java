package com.finsight.service;

import com.finsight.exception.DuplicateEmailException;
import com.finsight.model.dto.request.LoginRequest;
import com.finsight.model.dto.request.RegisterRequest;
import com.finsight.model.dto.response.AuthResponse;
import com.finsight.model.dto.response.TokenRefreshResponse;
import com.finsight.model.dto.response.UserResponse;
import com.finsight.model.entity.Account;
import com.finsight.model.entity.User;
import com.finsight.model.enums.AccountType;
import com.finsight.repository.AccountRepository;
import com.finsight.repository.UserRepository;
import com.finsight.security.JwtTokenProvider;
import com.finsight.security.SecurityUtils;
import com.finsight.util.CurrencyUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final AccountRepository accountRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;
    private final SecurityUtils securityUtils;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateEmailException("Email is already registered");
        }

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .build();
        user = userRepository.save(user);

        createDefaultSavingsAccount(user.getId());

        return buildAuthResponse(user);
    }

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalStateException("User not found after authentication"));

        return buildAuthResponse(user);
    }

    public TokenRefreshResponse refreshToken(String refreshToken) {
        if (!jwtTokenProvider.isRefreshToken(refreshToken)) {
            throw new IllegalArgumentException("Invalid refresh token");
        }

        String email = jwtTokenProvider.extractUsername(refreshToken);
        UserDetails userDetails = userDetailsService.loadUserByUsername(email);

        if (!jwtTokenProvider.isTokenValid(refreshToken, userDetails)) {
            throw new IllegalArgumentException("Refresh token is expired or invalid");
        }

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalStateException("User not found"));

        String newAccessToken = jwtTokenProvider.generateAccessToken(userDetails, user.getId());
        String newRefreshToken = jwtTokenProvider.generateRefreshToken(userDetails, user.getId());

        return TokenRefreshResponse.builder()
                .token(newAccessToken)
                .refreshToken(newRefreshToken)
                .build();
    }

    public UserResponse getCurrentUserProfile() {
        User user = securityUtils.getCurrentUser();
        return toUserResponse(user);
    }

    private AuthResponse buildAuthResponse(User user) {
        UserDetails userDetails = userDetailsService.loadUserByUsername(user.getEmail());
        String accessToken = jwtTokenProvider.generateAccessToken(userDetails, user.getId());
        String refreshToken = jwtTokenProvider.generateRefreshToken(userDetails, user.getId());

        return AuthResponse.builder()
                .token(accessToken)
                .refreshToken(refreshToken)
                .user(toUserResponse(user))
                .build();
    }

    private void createDefaultSavingsAccount(java.util.UUID userId) {
        String accountNumber = generateUniqueAccountNumber();

        Account account = Account.builder()
                .userId(userId)
                .accountNumber(accountNumber)
                .type(AccountType.SAVINGS)
                .balance(BigDecimal.ZERO)
                .build();

        accountRepository.save(account);
    }

    private String generateUniqueAccountNumber() {
        String accountNumber;
        do {
            accountNumber = CurrencyUtil.generateAccountNumber();
        } while (accountRepository.existsByAccountNumber(accountNumber));
        return accountNumber;
    }

    private UserResponse toUserResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .createdAt(user.getCreatedAt())
                .build();
    }
}
