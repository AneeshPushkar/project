package com.librarymanagement.controller;

import com.librarymanagement.dto.ApiResponse;
import com.librarymanagement.dto.BookDTO;
import com.librarymanagement.service.BookService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.http.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/books")
@RequiredArgsConstructor
public class BookController {

    private final BookService bookService;

    @GetMapping
    public ResponseEntity<ApiResponse<Page<BookDTO.Response>>> getAllBooks(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "title") String sortBy,
            @RequestParam(defaultValue = "asc") String direction) {

        Sort sort = direction.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();

        Pageable pageable = PageRequest.of(page, size, sort);

        return ResponseEntity.ok(
                ApiResponse.success("Books retrieved", bookService.getAllBooks(pageable))
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<BookDTO.Response>> getBookById(@PathVariable String id) {
        return ResponseEntity.ok(
                ApiResponse.success("Book found", bookService.getBookById(id))
        );
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<Page<BookDTO.Response>>> searchBooks(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        return ResponseEntity.ok(
                ApiResponse.success("Search results",
                        bookService.searchBooks(keyword, PageRequest.of(page, size)))
        );
    }

    @GetMapping("/available")
    public ResponseEntity<ApiResponse<Page<BookDTO.Response>>> getAvailableBooks(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        return ResponseEntity.ok(
                ApiResponse.success("Available books",
                        bookService.getAvailableBooks(PageRequest.of(page, size)))
        );
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<ApiResponse<Page<BookDTO.Response>>> getBooksByCategory(
            @PathVariable String category,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        return ResponseEntity.ok(
                ApiResponse.success("Books by category",
                        bookService.getBooksByCategory(category, PageRequest.of(page, size)))
        );
    }

    @GetMapping("/categories")
    public ResponseEntity<ApiResponse<List<String>>> getAllCategories() {
        return ResponseEntity.ok(
                ApiResponse.success("Categories", bookService.getAllCategories())
        );
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN','LIBRARIAN')")
    public ResponseEntity<ApiResponse<BookDTO.Response>> addBook(
            @Valid @RequestBody BookDTO.Request request) {

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Book added", bookService.addBook(request)));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','LIBRARIAN')")
    public ResponseEntity<ApiResponse<BookDTO.Response>> updateBook(
            @PathVariable String id,
            @Valid @RequestBody BookDTO.Request request) {

        return ResponseEntity.ok(
                ApiResponse.success("Book updated", bookService.updateBook(id, request))
        );
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteBook(@PathVariable String id) {

        bookService.deleteBook(id);
        return ResponseEntity.ok(ApiResponse.success("Book deleted"));
    }
}