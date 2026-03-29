package com.librarymanagement.controller;

import com.librarymanagement.dto.*;
import com.librarymanagement.service.IssueService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/issues")
@RequiredArgsConstructor
public class IssueController {

    private final IssueService issueService;

    // 🔥 MEMBER REQUEST
    @PostMapping("/request")
    public ResponseEntity<ApiResponse<IssueDTO.Response>> requestBook(
            @RequestBody IssueDTO.IssueRequest request) {

        return ResponseEntity.ok(
                ApiResponse.success("Request submitted", issueService.requestBook(request))
        );
    }

    // 🔥 ADMIN DIRECT ISSUE
    @PostMapping("/issue")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<IssueDTO.Response>> directIssue(
            @RequestBody IssueDTO.IssueRequest request) {

        return ResponseEntity.ok(
                ApiResponse.success("Direct Issue successful", issueService.directIssueBook(request))
        );
    }

    // 🔥 MEMBER RETURN REQUEST
    @PostMapping("/return-request")
    public ResponseEntity<ApiResponse<IssueDTO.Response>> requestReturn(
            @RequestBody IssueDTO.ReturnRequest request) {

        return ResponseEntity.ok(
                ApiResponse.success("Return Request submitted", issueService.requestReturnBook(request))
        );
    }

    // 🔥 ADMIN APPROVE
    @PostMapping("/approve/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<IssueDTO.Response>> approve(@PathVariable String id) {

        return ResponseEntity.ok(
                ApiResponse.success("Approved", issueService.approveRequest(id))
        );
    }

    // 🔥 ADMIN REJECT
    @PostMapping("/reject/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> reject(@PathVariable String id) {

        issueService.rejectRequest(id);

        return ResponseEntity.ok(ApiResponse.success("Rejected"));
    }

    // 🔥 GET PENDING
    @GetMapping("/pending")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<IssueDTO.Response>>> getPending() {

        return ResponseEntity.ok(
                ApiResponse.success("Pending requests", issueService.getPendingRequests())
        );
    }
    
    // 🔥 GET USER ISSUES
    @GetMapping("/user/{userId}")
    public ResponseEntity<ApiResponse<List<IssueDTO.Response>>> getUserIssues(@PathVariable String userId) {

        return ResponseEntity.ok(
                ApiResponse.success("User issues", issueService.getIssuesByUser(userId))
        );
    }

    // 🔥 GET FULL HISTORY
    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<IssueDTO.Response>>> getAllIssues() {

        return ResponseEntity.ok(
                ApiResponse.success("Issue History", issueService.getAllIssues())
        );
    }

    @PostMapping("/return")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<IssueDTO.Response>> returnBook(
            @RequestBody IssueDTO.ReturnRequest request) {

        return ResponseEntity.ok(
                ApiResponse.success("Returned", issueService.returnBook(request))
        );
    }
}