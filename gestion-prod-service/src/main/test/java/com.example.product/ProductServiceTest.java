package com.example.product;

import com.example.product.model.Product;
import com.example.product.service.ProductService;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

class ProductServiceTest {

    @Test
    void addProductShouldWork() {
        ProductService productService = new ProductService();
        Product p = productService.addProduct("TestProduct", 100);
        Assertions.assertNotNull(p.getId());
        Assertions.assertEquals("TestProduct", p.getName());
        Assertions.assertEquals(100, p.getQuantity());
    }
}
