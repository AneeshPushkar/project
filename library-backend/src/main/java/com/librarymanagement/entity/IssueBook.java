package com.librarymanagement.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Document(collection = "issues")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class IssueBook {

    @Id
    private String id;

    @DBRef(lazy = true)
    @JsonIgnore // 🔥 prevent recursion
    private User user;

    @DBRef(lazy = true)
    @JsonIgnore // 🔥 prevent recursion
    private Book book;

    private LocalDate issueDate;

    private LocalDate dueDate;

    private LocalDate returnDate;

    private BigDecimal fineAmount = BigDecimal.ZERO;

    private boolean finePaid = false;

    private IssueStatus status = IssueStatus.ISSUED;

    private String remarks;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();

        if (fineAmount == null) {
            fineAmount = BigDecimal.ZERO;
        }
    }

    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public enum IssueStatus {
        P_ISSUE,   // 🔥 Shortened for varchar 10 db constraints
        ISSUED,
        P_RETURN,  // 🔥 Shortened for varchar 10 db constraints
        RETURNED,
        OVERDUE,
        REJECTED   // 🔥 NEW
    }
}