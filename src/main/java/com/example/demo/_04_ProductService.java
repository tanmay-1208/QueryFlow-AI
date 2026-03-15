package com.example.demo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class _04_ProductService {
    
    @Autowired
    private _03_ProductRepository repository;

    public _02_Product saveProduct(_02_Product product) {
        return repository.save(product);
    }

    public List<_02_Product> getAllProducts() {
        return repository.findAll();
    }
}