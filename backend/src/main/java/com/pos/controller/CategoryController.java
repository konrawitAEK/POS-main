package com.pos.controller;

import com.pos.dto.request.CategoryRequest;
import com.pos.entity.Category;
import com.pos.repository.CategoryRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryRepository categoryRepository;

    @GetMapping
    public List<Category> list() {
        return categoryRepository.findAll();
    }

    @PostMapping
    public ResponseEntity<?> create(@Valid @RequestBody CategoryRequest req) {
        if (categoryRepository.existsByName(req.getName())) {
            return ResponseEntity.badRequest().body(Map.of("message", "มีหมวดหมู่นี้แล้ว"));
        }
        Category c = new Category();
        c.setName(req.getName());
        c.setDescription(req.getDescription());
        return ResponseEntity.ok(categoryRepository.save(c));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @Valid @RequestBody CategoryRequest req) {
        if (!categoryRepository.existsById(id)) return ResponseEntity.notFound().build();
        Category c = categoryRepository.findById(id).get();
        c.setName(req.getName());
        c.setDescription(req.getDescription());
        return ResponseEntity.ok(categoryRepository.save(c));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!categoryRepository.existsById(id)) return ResponseEntity.<Void>notFound().build();
        categoryRepository.deleteById(id);
        return ResponseEntity.ok().<Void>build();
    }
}
