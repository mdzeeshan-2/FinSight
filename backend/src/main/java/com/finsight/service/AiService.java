package com.finsight.service;

import com.finsight.config.OpenAiConfig;
import com.finsight.model.dto.request.ChatRequest;
import com.finsight.model.dto.response.ChatResponse;
import com.finsight.model.entity.ChatMessage;
import com.finsight.model.entity.User;
import com.finsight.model.enums.ChatRole;
import com.finsight.repository.ChatMessageRepository;
import com.finsight.security.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.*;

@Service
@RequiredArgsConstructor
public class AiService {

    private final ChatMessageRepository chatMessageRepository;
    private final SecurityUtils securityUtils;
    private final OpenAiConfig openAiConfig;
    private final WebClient.Builder webClientBuilder;

    @Transactional
    public ChatResponse chat(ChatRequest request) {
        User user = securityUtils.getCurrentUser();
        UUID conversationId = request.getConversationId() != null
                ? request.getConversationId()
                : UUID.randomUUID();

        chatMessageRepository.save(ChatMessage.builder()
                .userId(user.getId())
                .conversationId(conversationId)
                .role(ChatRole.USER)
                .content(request.getMessage())
                .build());

        List<Map<String, String>> messages = buildMessageHistory(user, conversationId, request.getMessage());
        String reply = callOpenAi(messages);

        chatMessageRepository.save(ChatMessage.builder()
                .userId(user.getId())
                .conversationId(conversationId)
                .role(ChatRole.ASSISTANT)
                .content(reply)
                .build());

        return ChatResponse.builder()
                .reply(reply)
                .conversationId(conversationId)
                .build();
    }

    private List<Map<String, String>> buildMessageHistory(User user, UUID conversationId, String currentMessage) {
        List<Map<String, String>> messages = new ArrayList<>();

        messages.add(Map.of(
                "role", "system",
                "content", """
                        You are Maya, the friendly AI assistant for FinSight banking app.
                        You help users understand their accounts, transactions, and general banking queries.
                        The user's name is %s.
                        Keep responses concise, friendly, and helpful.
                        For specific account data, encourage them to check their dashboard.
                        Never make up specific numbers or account details.
                        Always respond in plain conversational text, no markdown.
                        """.formatted(user.getName())
        ));

        List<ChatMessage> history = chatMessageRepository
                .findByUserIdAndConversationIdOrderByCreatedAtDesc(
                        user.getId(),
                        conversationId,
                        PageRequest.of(0, 10)
                );

        Collections.reverse(history);
        for (ChatMessage message : history) {
            if (message.getRole() == ChatRole.USER && message.getContent().equals(currentMessage)) {
                continue;
            }
            messages.add(Map.of(
                    "role", message.getRole() == ChatRole.USER ? "user" : "assistant",
                    "content", message.getContent()
            ));
        }

        messages.add(Map.of("role", "user", "content", currentMessage));
        return messages;
    }

    private String callOpenAi(List<Map<String, String>> messages) {
        if (openAiConfig.getApiKey() == null || openAiConfig.getApiKey().isBlank()) {
            return "Maya is currently offline. Please configure OPENAI_API_KEY on the server to enable AI chat.";
        }

        Map<String, Object> requestBody = Map.of(
                "model", openAiConfig.getModel(),
                "messages", messages,
                "temperature", 0.7
        );

        WebClient client = webClientBuilder
                .baseUrl(openAiConfig.getBaseUrl())
                .defaultHeader("Authorization", "Bearer " + openAiConfig.getApiKey())
                .build();

        Map<?, ?> response = client.post()
                .uri("/chat/completions")
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(Map.class)
                .block();

        if (response == null) {
            throw new IllegalStateException("Empty response from OpenAI");
        }

        List<?> choices = (List<?>) response.get("choices");
        if (choices == null || choices.isEmpty()) {
            throw new IllegalStateException("No choices returned from OpenAI");
        }

        Map<?, ?> firstChoice = (Map<?, ?>) choices.get(0);
        Map<?, ?> message = (Map<?, ?>) firstChoice.get("message");
        Object content = message.get("content");

        return content != null ? content.toString().trim() : "Sorry, I could not generate a response.";
    }
}
