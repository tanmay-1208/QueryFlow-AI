package com.example.demo;

import org.springframework.stereotype.Service;

@Service
public class _06_SchemaService {
    public String getSchemaDescription() {
        return "Table: product (id SERIAL PRIMARY KEY, name VARCHAR(255), price INT, stock INT)";
    }
}