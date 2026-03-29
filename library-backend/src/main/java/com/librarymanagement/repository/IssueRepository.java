package com.librarymanagement.repository;

import com.librarymanagement.entity.IssueBook;
import com.librarymanagement.entity.IssueBook.IssueStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface IssueRepository extends MongoRepository<IssueBook, String> {

    List<IssueBook> findByUser_Id(String userId);

    Page<IssueBook> findByBook_Id(String bookId, Pageable pageable);

    Page<IssueBook> findByStatus(IssueStatus status, Pageable pageable);

    List<IssueBook> findByStatus(IssueStatus status);

    List<IssueBook> findByStatusIn(List<IssueStatus> statuses);

    List<IssueBook> findByUser_IdAndStatus(String userId, IssueStatus status);

    boolean existsByUser_IdAndBook_IdAndStatus(String userId, String bookId, IssueStatus status);

    List<IssueBook> findByDueDateBeforeAndStatus(LocalDate today, IssueStatus status);

    Page<IssueBook> findByDueDateBeforeAndStatus(LocalDate today, IssueStatus status, Pageable pageable);

    long countByStatus(IssueStatus status);

    long countByUser_IdAndStatus(String userId, IssueStatus status);

    @Query(value = "{ 'issueDate' : { '$gte' : ?0, '$lte' : ?1 } }")
    Page<IssueBook> findByIssueDateBetween(LocalDate startDate, LocalDate endDate, Pageable pageable);

    @Query(value = "{ 'finePaid': false, 'fineAmount': { '$gt': 0 } }")
    List<IssueBook> findWithPendingFine();
}