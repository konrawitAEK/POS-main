package com.pos.service;

import com.pos.dto.request.CategoryRequest;
import com.pos.entity.Category;
import com.pos.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public List<Category> list() {
        return categoryRepository.findAll();
    }

    public Category create(CategoryRequest req) {
        if (categoryRepository.existsByName(req.getName())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "มีหมวดหมู่นี้แล้ว");
        }
        Category c = new Category();
        c.setName(req.getName());
        c.setDescription(req.getDescription());
        return categoryRepository.save(c);
    }

    public Category update(Long id, CategoryRequest req) {
        Category c = categoryRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        c.setName(req.getName());
        c.setDescription(req.getDescription());
        return categoryRepository.save(c);
    }

    public void delete(Long id) {
        if (!categoryRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        }
        categoryRepository.deleteById(id);
    }
}
