package com.librarymanagement.dto;

import com.librarymanagement.entity.Book;
import lombok.*;

import jakarta.validation.constraints.*;
import java.time.LocalDateTime;

public class BookDTO {

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Request {

        @NotBlank(message = "Title is required")
        @Size(max = 255)
        private String title;

        @NotBlank(message = "Author is required")
        @Size(max = 150)
        private String author;

        @NotBlank(message = "ISBN is required")
        @Size(max = 20)
        private String isbn;

        private String category;
        private String publisher;
        private Integer publishedYear;

        @Min(value = 1, message = "Total copies must be at least 1")
        private int totalCopies = 1;

        private String description;
        private String coverImageUrl;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Response {

        private String id;
        private String title;
        private String author;
        private String isbn;
        private String category;
        private String publisher;
        private Integer publishedYear;
        private int totalCopies;
        private int availableCopies;
        private String description;
        private String coverImageUrl;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;

        public static Response fromEntity(Book book) {

            if (book == null) return null;

            return Response.builder()
                    .id(book.getId())
                    .title(book.getTitle())
                    .author(book.getAuthor())
                    .isbn(book.getIsbn())
                    .category(book.getCategory())
                    .publisher(book.getPublisher())
                    .publishedYear(book.getPublishedYear())
                    .totalCopies(book.getTotalCopies())
                    .availableCopies(book.getAvailableCopies())
                    .description(book.getDescription())
                    .coverImageUrl(book.getCoverImageUrl())
                    .createdAt(book.getCreatedAt())
                    .updatedAt(book.getUpdatedAt())
                    .build();
        }
    }
}