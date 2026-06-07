package com.finsight.util;

import java.math.BigDecimal;
import java.text.NumberFormat;
import java.util.Locale;
import java.util.concurrent.ThreadLocalRandom;

public final class CurrencyUtil {

    private static final NumberFormat INDIAN_FORMAT = NumberFormat.getCurrencyInstance(new Locale("en", "IN"));

    static {
        INDIAN_FORMAT.setMaximumFractionDigits(2);
        INDIAN_FORMAT.setMinimumFractionDigits(2);
    }

    private CurrencyUtil() {
    }

    public static String formatIndianRupee(BigDecimal amount) {
        if (amount == null) {
            return "₹0.00";
        }
        return INDIAN_FORMAT.format(amount);
    }

    public static String generateAccountNumber() {
        long randomPart = ThreadLocalRandom.current().nextLong(1_000_000_000L, 9_999_999_999L);
        return "FS" + randomPart;
    }

    public static String generateAccountNumberFromTimestamp() {
        String timestamp = String.valueOf(System.currentTimeMillis());
        String suffix = timestamp.substring(Math.max(0, timestamp.length() - 10));
        return "FS" + suffix;
    }
}
