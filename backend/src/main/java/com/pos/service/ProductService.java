package com.pos.service;

import com.pos.dto.request.ProductRequest;
import com.pos.dto.response.ProductResponse;
import com.pos.entity.Product;
import com.pos.repository.CategoryRepository;
import com.pos.repository.ProductRepository;
import com.pos.repository.SupplierRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository  productRepository;
    private final CategoryRepository categoryRepository;
    private final SupplierRepository supplierRepository;

    public Page<ProductResponse> list(int page, int size, String q) {
        var pageable = PageRequest.of(page, size, Sort.by("name"));
        Page<Product> result = (q != null && !q.isBlank())
                ? productRepository.search(q, pageable)
                : productRepository.findByIsActiveTrue(pageable);
        return result.map(ProductResponse::from);
    }

    public ProductResponse get(Long id) {
        return productRepository.findById(id)
                .map(ProductResponse::from)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
    }

    public ProductResponse getByBarcode(String barcode) {
        return productRepository.findByBarcode(barcode)
                .map(ProductResponse::from)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
    }

    public ProductResponse create(ProductRequest req) {
        Product p = new Product();
        applyRequest(p, req);
        return ProductResponse.from(productRepository.save(p));
    }

    public ProductResponse update(Long id, ProductRequest req) {
        Product p = productRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        applyRequest(p, req);
        return ProductResponse.from(productRepository.save(p));
    }

    public void delete(Long id) {
        Product p = productRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        p.setIsActive(false);
        productRepository.save(p);
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
