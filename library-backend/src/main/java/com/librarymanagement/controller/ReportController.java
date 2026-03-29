package com.librarymanagement.controller;

import com.librarymanagement.dto.ApiResponse;
import com.librarymanagement.dto.IssueDTO;
import com.librarymanagement.entity.IssueBook;
import com.librarymanagement.entity.User;
import com.librarymanagement.repository.BookRepository;
import com.librarymanagement.repository.IssueRepository;
import com.librarymanagement.repository.UserRepository;
import com.librarymanagement.service.IssueService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('ADMIN', 'LIBRARIAN')")
public class ReportController {

    private final BookRepository bookRepository;
    private final UserRepository userRepository;
    private final IssueRepository issueRepository;
    private final IssueService issueService;

    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();

        stats.put("totalBooks", bookRepository.count());
        stats.put("availableBooks", bookRepository.countByAvailableCopiesGreaterThan(0));
        stats.put("totalUsers", userRepository.count());
        stats.put("activeUsers", userRepository.countByActiveTrue());
        stats.put("totalMembers", userRepository.countByRole(User.Role.MEMBER));
        stats.put("totalIssued", issueRepository.countByStatus(IssueBook.IssueStatus.ISSUED));
        stats.put("totalOverdue", issueRepository.countByStatus(IssueBook.IssueStatus.OVERDUE));
        stats.put("totalReturned", issueRepository.countByStatus(IssueBook.IssueStatus.RETURNED));

        double pendingFines = issueRepository.findWithPendingFine().stream()
                .map(IssueBook::getFineAmount)
                .filter(amount -> amount != null)
                .mapToDouble(amount -> amount.doubleValue())
                .sum();
        stats.put("totalPendingFines", pendingFines);

        return ResponseEntity.ok(ApiResponse.success("Dashboard stats", stats));
    }

    @GetMapping("/overdue")
    public ResponseEntity<ApiResponse<List<IssueDTO.Response>>> getOverdueReport() {
        List<IssueDTO.Response> overdue = issueService.getOverdueIssues();
        return ResponseEntity.ok(ApiResponse.success("Overdue report", overdue));
    }

    @GetMapping("/issues-by-date")
    public ResponseEntity<ApiResponse<Page<IssueDTO.Response>>> getIssuesByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        Pageable pageable = PageRequest.of(page, size);
        Page<IssueDTO.Response> issues = issueRepository
                .findByIssueDateBetween(startDate, endDate, pageable)
                .map(IssueDTO.Response::fromEntity);

        return ResponseEntity.ok(ApiResponse.success("Issues in date range", issues));
    }

    @GetMapping("/categories")
    public ResponseEntity<ApiResponse<List<String>>> getCategoryReport() {
        return ResponseEntity.ok(ApiResponse.success("Book categories", bookRepository.findAllCategories()));
    }

    @GetMapping("/members")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getMemberStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalMembers", userRepository.countByRole(User.Role.MEMBER));
        stats.put("activeMembers", userRepository.countByActiveTrue());
        stats.put("admins", userRepository.countByRole(User.Role.ADMIN));
        stats.put("librarians", userRepository.countByRole(User.Role.LIBRARIAN));
        return ResponseEntity.ok(ApiResponse.success("Member statistics", stats));
    }
}
