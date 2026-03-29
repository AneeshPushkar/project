package com.librarymanagement.dto;

import com.librarymanagement.entity.IssueBook;
import lombok.*;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class IssueDTO {

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class IssueRequest {

        @NotNull(message = "User ID is required")
        private String userId;

        @NotNull(message = "Book ID is required")
        private String bookId;

        @NotNull(message = "Due date is required")
        @Future(message = "Due date must be in the future")
        private LocalDate dueDate;

        private String remarks;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ReturnRequest {

        @NotNull(message = "Issue ID is required")
        private String issueId;

        private String remarks;
        private boolean finePaid = false;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Response {

        private String id;
        private String userId;
        private String userName;
        private String userEmail;
        private String bookId;
        private String bookTitle;
        private String bookIsbn;
        private LocalDate issueDate;
        private LocalDate dueDate;
        private LocalDate returnDate;
        private BigDecimal fineAmount;
        private boolean finePaid;
        private String status;
        private String remarks;
        private LocalDateTime createdAt;

        public static Response fromEntity(IssueBook issue) {

            if (issue == null) return null;

            return Response.builder()
                    .id(issue.getId())
                    .userId(issue.getUser() != null ? issue.getUser().getId() : null)
                    .userName(issue.getUser() != null ? issue.getUser().getName() : null)
                    .userEmail(issue.getUser() != null ? issue.getUser().getEmail() : null)
                    .bookId(issue.getBook() != null ? issue.getBook().getId() : null)
                    .bookTitle(issue.getBook() != null ? issue.getBook().getTitle() : null)
                    .bookIsbn(issue.getBook() != null ? issue.getBook().getIsbn() : null)
                    .issueDate(issue.getIssueDate())
                    .dueDate(issue.getDueDate())
                    .returnDate(issue.getReturnDate())
                    .fineAmount(issue.getFineAmount())
                    .finePaid(issue.isFinePaid())
                    .status(issue.getStatus() != null ? issue.getStatus().name() : null)
                    .remarks(issue.getRemarks())
                    .createdAt(issue.getCreatedAt())
                    .build();
        }
    }
}