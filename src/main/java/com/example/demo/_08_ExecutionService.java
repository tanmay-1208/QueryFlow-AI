package com.example.demo;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Map;

@Service
public class _08_ExecutionService {

    private final JdbcTemplate jdbcTemplate;

    public _08_ExecutionService(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<Map<String, Object>> runQuery(String sql) {
        return jdbcTemplate.queryForList(sql);
    }

    public void runUpdate(String sql, Object... params) {
        jdbcTemplate.update(sql, params);
    }
}
