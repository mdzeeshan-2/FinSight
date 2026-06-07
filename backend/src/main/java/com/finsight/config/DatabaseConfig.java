package com.finsight.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.jdbc.DataSourceProperties;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

import javax.sql.DataSource;
import java.net.URI;

/**
 * Converts Railway-style DATABASE_URL (postgresql://...) to JDBC format.
 */
@Configuration
public class DatabaseConfig {

    @Bean
    @Primary
    public DataSource dataSource(
            DataSourceProperties properties,
            @Value("${spring.datasource.url}") String configuredUrl,
            @Value("${spring.datasource.username}") String username,
            @Value("${spring.datasource.password}") String password
    ) {
        if (configuredUrl.startsWith("postgresql://") || configuredUrl.startsWith("postgres://")) {
            return buildFromRailwayUrl(configuredUrl);
        }

        return DataSourceBuilder.create()
                .url(configuredUrl)
                .username(username)
                .password(password)
                .driverClassName(properties.getDriverClassName())
                .build();
    }

    private DataSource buildFromRailwayUrl(String databaseUrl) {
        try {
            URI dbUri = URI.create(databaseUrl.replace("postgres://", "postgresql://"));

            String jdbcUrl = "jdbc:postgresql://" + dbUri.getHost()
                    + (dbUri.getPort() > 0 ? ":" + dbUri.getPort() : "")
                    + dbUri.getPath();

            String[] userInfo = dbUri.getUserInfo() != null ? dbUri.getUserInfo().split(":", 2) : new String[]{"", ""};
            String user = userInfo.length > 0 ? userInfo[0] : "";
            String pass = userInfo.length > 1 ? userInfo[1] : "";

            if (dbUri.getQuery() != null && !dbUri.getQuery().isBlank()) {
                jdbcUrl += "?" + dbUri.getQuery();
            }

            return DataSourceBuilder.create()
                    .url(jdbcUrl)
                    .username(user)
                    .password(pass)
                    .driverClassName("org.postgresql.Driver")
                    .build();
        } catch (Exception ex) {
            throw new IllegalStateException("Invalid DATABASE_URL format", ex);
        }
    }
}
