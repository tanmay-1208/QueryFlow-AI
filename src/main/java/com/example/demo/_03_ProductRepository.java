package com.example.demo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface _03_ProductRepository extends JpaRepository<_02_Product, Long> {
}