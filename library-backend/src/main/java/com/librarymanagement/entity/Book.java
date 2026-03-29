package com.librarymanagement.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

@Document(collection = "books")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Book {

    @Id
    private String id;

    private String title;

    private String author;

    @Indexed(unique = true)
    private String isbn;

    private String category;

    private String publisher;

    private Integer publishedYear;

    private int totalCopies = 1;

    private int availableCopies = 1;

    private String description;

    private String coverImageUrl;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    @JsonIgnore // 🔥 PREVENT LOOP
    private List<IssueBook> issueRecords;

    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();

        // ✅ Ensure available copies matches total
        if (availableCopies == 0) {
            availableCopies = totalCopies;
        }
    }

    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}