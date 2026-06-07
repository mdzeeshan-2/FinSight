package com.finsight.repository;

import com.finsight.model.entity.ChatMessage;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, UUID> {

    List<ChatMessage> findByUserIdAndConversationIdOrderByCreatedAtAsc(
            UUID userId,
            UUID conversationId,
            Pageable pageable
    );

    List<ChatMessage> findByUserIdAndConversationIdOrderByCreatedAtDesc(
            UUID userId,
            UUID conversationId,
            Pageable pageable
    );
}
