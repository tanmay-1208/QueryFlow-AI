package com.example.demo;

import org.springframework.stereotype.Service;
import java.util.Arrays;
import java.util.List;
// abcs33

@Service
public class _07_SecurityValidator {

    // Blacklist of dangerous SQL keywords
    private static final List<String> BLACKLIST = Arrays.asList(
        "DROP", "DELETE", "UPDATE", "TRUNCATE", "ALTER", "INSERT"
    );

    public boolean isSafe(String sql) {
        String upperSql = sql.toUpperCase();
        
        // Ensure the query ONLY starts with SELECT
        if (!upperSql.trim().startsWith("SELECT")) {
            return false;
        }

        // Check if any forbidden words are hiding inside
        for (String forbidden : BLACKLIST) {
            if (upperSql.contains(forbidden)) {
                return false;
            }
        }
        return true;
    }
}
