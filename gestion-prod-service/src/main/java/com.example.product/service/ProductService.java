package com.example.product.service;

import com.example.product.model.Product;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.atomic.AtomicLong;

@Service
public class ProductService {
    private Map<Long, Product> products = new HashMap<>();
    private AtomicLong idCounter = new AtomicLong(1);

    public Product addProduct(String name, int quantity) {
        long id = idCounter.getAndIncrement();
        Product product = new Product(id, name, quantity);
        products.put(id, product);
        return product;
    }

    public Product getProduct(Long id) {
        return products.get(id);
    }

    public List<Product> getAllProducts() {
        return new ArrayList<>(products.values());
    }
}
