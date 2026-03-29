package com.librarymanagement.service;

import com.librarymanagement.dto.BookDTO;
import com.librarymanagement.entity.Book;
import com.librarymanagement.repository.BookRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BookService {

    private final BookRepository bookRepository;

    // ✅ ADD BOOK
    @Transactional
    public BookDTO.Response addBook(BookDTO.Request request) {

        if (bookRepository.existsByIsbn(request.getIsbn())) {
            throw new IllegalArgumentException("Book with ISBN already exists: " + request.getIsbn());
        }

        Book book = Book.builder()
                .title(request.getTitle())
                .author(request.getAuthor())
                .isbn(request.getIsbn())
                .category(request.getCategory())
                .publisher(request.getPublisher())
                .publishedYear(request.getPublishedYear())
                .totalCopies(request.getTotalCopies())
                .availableCopies(request.getTotalCopies()) // ✅ sync copies
                .description(request.getDescription())
                .coverImageUrl(request.getCoverImageUrl())
                .build();

        return BookDTO.Response.fromEntity(bookRepository.save(book));
    }

    // ✅ GET BOOK BY ID
    public BookDTO.Response getBookById(String id) {

        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Book not found with id: " + id));

        return BookDTO.Response.fromEntity(book);
    }

    // ✅ GET ALL BOOKS
    public Page<BookDTO.Response> getAllBooks(Pageable pageable) {
        return bookRepository.findAll(pageable)
                .map(BookDTO.Response::fromEntity);
    }

    // ✅ SEARCH BOOKS
    public Page<BookDTO.Response> searchBooks(String keyword, Pageable pageable) {
        return bookRepository.searchBooks(keyword, pageable)
                .map(BookDTO.Response::fromEntity);
    }

    // ✅ GET BY CATEGORY
    public Page<BookDTO.Response> getBooksByCategory(String category, Pageable pageable) {
        return bookRepository.findByCategoryIgnoreCase(category, pageable)
                .map(BookDTO.Response::fromEntity);
    }

    // ✅ GET AVAILABLE BOOKS
    public Page<BookDTO.Response> getAvailableBooks(Pageable pageable) {
        return bookRepository.findAvailableBooks(pageable)
                .map(BookDTO.Response::fromEntity);
    }

    // ✅ GET ALL CATEGORIES
    public List<String> getAllCategories() {
        return bookRepository.findAllCategories();
    }

    // ✅ UPDATE BOOK
    @Transactional
    public BookDTO.Response updateBook(String id, BookDTO.Request request) {

        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Book not found: " + id));

        // ✅ Check ISBN duplication
        if (!book.getIsbn().equals(request.getIsbn()) &&
                bookRepository.existsByIsbn(request.getIsbn())) {
            throw new IllegalArgumentException("ISBN already in use: " + request.getIsbn());
        }

        // ✅ Adjust available copies correctly
        int difference = request.getTotalCopies() - book.getTotalCopies();

        book.setTitle(request.getTitle());
        book.setAuthor(request.getAuthor());
        book.setIsbn(request.getIsbn());
        book.setCategory(request.getCategory());
        book.setPublisher(request.getPublisher());
        book.setPublishedYear(request.getPublishedYear());
        book.setTotalCopies(request.getTotalCopies());

        int updatedAvailable = book.getAvailableCopies() + difference;
        book.setAvailableCopies(Math.max(0, updatedAvailable));

        book.setDescription(request.getDescription());
        book.setCoverImageUrl(request.getCoverImageUrl());

        return BookDTO.Response.fromEntity(bookRepository.save(book));
    }

    // ✅ DELETE BOOK
    @Transactional
    public void deleteBook(String id) {

        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Book not found: " + id));

        // ❗ Prevent deleting issued books
        if (book.getAvailableCopies() != book.getTotalCopies()) {
            throw new IllegalStateException("Cannot delete book: copies are currently issued");
        }

        bookRepository.delete(book);
    }

    // ===============================
    // 🔧 INTERNAL METHODS (USED BY ISSUE SERVICE)
    // ===============================

    public Book getBookEntityById(String id) {
        return bookRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Book not found: " + id));
    }

    @Transactional
    public void decrementAvailableCopies(String bookId) {

        Book book = getBookEntityById(bookId);

        if (book.getAvailableCopies() <= 0) {
            throw new IllegalStateException("No copies available for: " + book.getTitle());
        }

        book.setAvailableCopies(book.getAvailableCopies() - 1);
        bookRepository.save(book);
    }

    @Transactional
    public void incrementAvailableCopies(String bookId) {

        Book book = getBookEntityById(bookId);

        int updated = book.getAvailableCopies() + 1;

        // ✅ Prevent overflow
        book.setAvailableCopies(Math.min(updated, book.getTotalCopies()));

        bookRepository.save(book);
    }
}