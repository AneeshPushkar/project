package com.librarymanagement.service;

import com.librarymanagement.dto.IssueDTO;
import com.librarymanagement.dto.IssueDTO.Response;
import com.librarymanagement.entity.Book;
import com.librarymanagement.entity.IssueBook;
import com.librarymanagement.entity.IssueBook.IssueStatus;
import com.librarymanagement.entity.User;
import com.librarymanagement.repository.IssueRepository;
import com.librarymanagement.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Arrays;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class IssueService {

    private static final BigDecimal FINE_PER_DAY = new BigDecimal("5.00");

    private final IssueRepository issueRepository;
    private final UserRepository userRepository;
    private final BookService bookService;

    // 🔥 MEMBER REQUEST (NEW)
    @Transactional
    public IssueDTO.Response requestBook(IssueDTO.IssueRequest request) {

        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        Book book = bookService.getBookEntityById(request.getBookId());

        IssueBook issue = IssueBook.builder()
                .user(user)
                .book(book)
                .issueDate(LocalDate.now())
                .dueDate(request.getDueDate())
                .status(IssueStatus.P_ISSUE) // 🔥 updated
                .fineAmount(BigDecimal.ZERO)
                .finePaid(false)
                .remarks("Requested by user")
                .build();

        return IssueDTO.Response.fromEntity(issueRepository.save(issue));
    }

    // 🔥 ADMIN DIRECT ISSUE
    @Transactional
    public IssueDTO.Response directIssueBook(IssueDTO.IssueRequest request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        Book book = bookService.getBookEntityById(request.getBookId());

        if (book.getAvailableCopies() <= 0) {
            throw new IllegalStateException("No copies available");
        }

        bookService.decrementAvailableCopies(book.getId());

        IssueBook issue = IssueBook.builder()
                .user(user)
                .book(book)
                .issueDate(LocalDate.now())
                .dueDate(request.getDueDate())
                .status(IssueStatus.ISSUED)
                .fineAmount(BigDecimal.ZERO)
                .finePaid(false)
                .remarks("Directly issued by admin")
                .build();

        return IssueDTO.Response.fromEntity(issueRepository.save(issue));
    }

    // 🔥 ADMIN APPROVE
    @Transactional
    public IssueDTO.Response approveRequest(String id) {

        IssueBook issue = issueRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Request not found"));

        if (issue.getStatus() == IssueStatus.P_ISSUE) {
            Book book = issue.getBook();
            if (book.getAvailableCopies() <= 0) {
                throw new IllegalStateException("No copies available");
            }
            bookService.decrementAvailableCopies(book.getId());
            issue.setStatus(IssueStatus.ISSUED);
        } else if (issue.getStatus() == IssueStatus.P_RETURN) {
            LocalDate returnDate = LocalDate.now();
            issue.setReturnDate(returnDate);
            issue.setStatus(IssueStatus.RETURNED);

            if (returnDate.isAfter(issue.getDueDate())) {
                long days = ChronoUnit.DAYS.between(issue.getDueDate(), returnDate);
                issue.setFineAmount(FINE_PER_DAY.multiply(BigDecimal.valueOf(days)));
            }
            bookService.incrementAvailableCopies(issue.getBook().getId());
        } else {
            throw new IllegalStateException("Not a pending request");
        }

        return IssueDTO.Response.fromEntity(issueRepository.save(issue));
    }

    // 🔥 ADMIN REJECT
    @Transactional
    public void rejectRequest(String id) {

        IssueBook issue = issueRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Request not found"));

        issue.setStatus(IssueStatus.REJECTED);

        issueRepository.save(issue);
    }

    // 🔥 RETURN (same but clean)
    @Transactional
    public IssueDTO.Response returnBook(IssueDTO.ReturnRequest request) {

        IssueBook issue = issueRepository.findById(request.getIssueId())
                .orElseThrow(() -> new IllegalArgumentException("Issue not found"));

        if (issue.getStatus() != IssueStatus.ISSUED) {
            throw new IllegalStateException("Book not issued");
        }

        LocalDate returnDate = LocalDate.now();

        issue.setReturnDate(returnDate);
        issue.setStatus(IssueStatus.RETURNED);

        if (returnDate.isAfter(issue.getDueDate())) {
            long days = ChronoUnit.DAYS.between(issue.getDueDate(), returnDate);
            issue.setFineAmount(FINE_PER_DAY.multiply(BigDecimal.valueOf(days)));
            issue.setFinePaid(request.isFinePaid());
        }

        bookService.incrementAvailableCopies(issue.getBook().getId());

        return IssueDTO.Response.fromEntity(issueRepository.save(issue));
    }

    // 🔥 MEMBER RETURN REQUEST
    @Transactional
    public IssueDTO.Response requestReturnBook(IssueDTO.ReturnRequest request) {

        IssueBook issue = issueRepository.findById(request.getIssueId())
                .orElseThrow(() -> new IllegalArgumentException("Issue not found"));

        if (issue.getStatus() != IssueStatus.ISSUED) {
            throw new IllegalStateException("Book not currently issued");
        }

        issue.setStatus(IssueStatus.P_RETURN);
        return IssueDTO.Response.fromEntity(issueRepository.save(issue));
    }

    // 🔥 GET PENDING
    @Transactional(readOnly = true)
    public List<IssueDTO.Response> getPendingRequests() {
        return issueRepository.findByStatusIn(Arrays.asList(IssueStatus.P_ISSUE, IssueStatus.P_RETURN))
                .stream()
                .map(IssueDTO.Response::fromEntity)
                .collect(Collectors.toList());
    }

    // 🔥 GET USER ISSUES
    @Transactional(readOnly = true)
    public List<IssueDTO.Response> getIssuesByUser(String userId) {
        return issueRepository.findByUser_Id(userId)
                .stream()
                .map(IssueDTO.Response::fromEntity)
                .collect(Collectors.toList());
    }

    // 🔥 GET ALL ISSUES (HISTORY)
    @Transactional(readOnly = true)
    public List<IssueDTO.Response> getAllIssues() {
        return issueRepository.findAll()
                .stream()
                .map(IssueDTO.Response::fromEntity)
                .collect(Collectors.toList());
    }

	public List<Response> getOverdueIssues() {
		return issueRepository.findByDueDateBeforeAndStatus(LocalDate.now(), IssueStatus.ISSUED)
                .stream()
                .map(IssueDTO.Response::fromEntity)
                .collect(Collectors.toList());
	}
}