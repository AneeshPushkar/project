package com.librarymanagement.repository;

import com.librarymanagement.entity.Book;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Repository
public interface BookRepository extends MongoRepository<Book, String> {

    Optional<Book> findByIsbn(String isbn);

    boolean existsByIsbn(String isbn);

    Page<Book> findByTitleContainingIgnoreCase(String title, Pageable pageable);

    Page<Book> findByAuthorContainingIgnoreCase(String author, Pageable pageable);

    Page<Book> findByCategoryIgnoreCase(String category, Pageable pageable);

    @Query("{'$or': [" +
            "{'title':   {'$regex': ?0, '$options': 'i'}}," +
            "{'author':  {'$regex': ?0, '$options': 'i'}}," +
            "{'isbn':    {'$regex': ?0, '$options': 'i'}}," +
            "{'category':{'$regex': ?0, '$options': 'i'}}]}")
    Page<Book> searchBooks(String keyword, Pageable pageable);

    @Query("{'availableCopies': {'$gt': 0}}")
    Page<Book> findAvailableBooks(Pageable pageable);

    default List<String> findAllCategories() {
        return findAll().stream()
                .map(Book::getCategory)
                .filter(category -> category != null && !category.isBlank())
                .distinct()
                .sorted(Comparator.naturalOrder())
                .collect(Collectors.toList());
    }

    long countByAvailableCopiesGreaterThan(int copies);
}