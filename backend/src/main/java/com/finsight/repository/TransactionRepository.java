package com.finsight.repository;

import com.finsight.model.entity.Transaction;
import com.finsight.model.enums.TransactionType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public interface TransactionRepository extends JpaRepository<Transaction, UUID> {

    Page<Transaction> findByAccountIdOrderByCreatedAtDesc(UUID accountId, Pageable pageable);

    @Query("""
            SELECT t FROM Transaction t
            WHERE t.accountId IN :accountIds
            ORDER BY t.createdAt DESC
            """)
    List<Transaction> findRecentByAccountIds(@Param("accountIds") List<UUID> accountIds, Pageable pageable);

    @Query("""
            SELECT COALESCE(SUM(t.amount), 0) FROM Transaction t
            WHERE t.accountId IN :accountIds
            AND t.type IN :types
            AND t.createdAt >= :start
            AND t.createdAt < :end
            """)
    BigDecimal sumAmountByAccountIdsAndTypesAndDateRange(
            @Param("accountIds") List<UUID> accountIds,
            @Param("types") List<TransactionType> types,
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end
    );

    @Query("""
            SELECT COALESCE(SUM(t.amount), 0) FROM Transaction t
            WHERE t.accountId IN :accountIds
            AND t.type IN :types
            AND t.createdAt >= :start
            AND t.createdAt < :end
            """)
    BigDecimal sumByMonth(
            @Param("accountIds") List<UUID> accountIds,
            @Param("types") List<TransactionType> types,
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end
    );
}
