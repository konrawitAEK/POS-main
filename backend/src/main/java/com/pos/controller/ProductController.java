package com.pos.controller;

import com.pos.dto.request.ProductRequest;
import com.pos.dto.response.ProductResponse;
import com.pos.entity.Product;
import com.pos.repository.CategoryRepository;
import com.pos.repository.ProductRepository;
import com.pos.repository.SupplierRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.math.BigDecimal;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductRepository  productRepository;
    private final CategoryRepository categoryRepository;
    private final SupplierRepository supplierRepository;

    @GetMapping
    public ResponseEntity<Page<ProductResponse>> list(
            @RequestParam(defaultValue = "0")  int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false)    String q) {
        var pageable = PageRequest.of(page, size, Sort.by("name"));
        Page<Product> result = (q != null && !q.isBlank())
                ? productRepository.search(q, pageable)
                : productRepository.findByIsActiveTrue(pageable);
        return ResponseEntity.ok(result.map(ProductResponse::from));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductResponse> get(@PathVariable Long id) {
        if (!productRepository.existsById(id)) return ResponseEntity.<ProductResponse>notFound().build();
        return ResponseEntity.ok(ProductResponse.from(productRepository.findById(id).get()));
    }

    @GetMapping("/barcode/{barcode}")
    public ResponseEntity<ProductResponse> getByBarcode(@PathVariable String barcode) {
        return productRepository.findByBarcode(barcode)
                .map(p -> ResponseEntity.ok(ProductResponse.from(p)))
                .orElse(ResponseEntity.<ProductResponse>notFound().build());
    }

    @PostMapping
    public ResponseEntity<ProductResponse> create(@Valid @RequestBody ProductRequest req) {
        Product p = new Product();
        applyRequest(p, req);
        return ResponseEntity.ok(ProductResponse.from(productRepository.save(p)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProductResponse> update(@PathVariable Long id, @Valid @RequestBody ProductRequest req) {
        if (!productRepository.existsById(id)) return ResponseEntity.<ProductResponse>notFound().build();
        Product p = productRepository.findById(id).get();
        applyRequest(p, req);
        return ResponseEntity.ok(ProductResponse.from(productRepository.save(p)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!productRepository.existsById(id)) return ResponseEntity.<Void>notFound().build();
        Product p = productRepository.findById(id).get();
        p.setIsActive(false);
        productRepository.save(p);
        return ResponseEntity.ok().<Void>build();
    }

    private void applyRequest(Product p, ProductRequest req) {
        p.setName(req.getName());
        p.setBarcode(req.getBarcode());
        p.setDescription(req.getDescription());
        p.setPrice(req.getPrice());
        p.setCostPrice(req.getCostPrice() != null ? req.getCostPrice() : BigDecimal.ZERO);
        p.setImageUrl(req.getImageUrl());
        if (req.getCategoryId() != null) categoryRepository.findById(req.getCategoryId()).ifPresent(p::setCategory);
        else p.setCategory(null);
        if (req.getSupplierId() != null) supplierRepository.findById(req.getSupplierId()).ifPresent(p::setSupplier);
        else p.setSupplier(null);
    }
}
