package com.librarymanagement.repository;

import com.librarymanagement.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends MongoRepository<User, String> {

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    Page<User> findByRole(User.Role role, Pageable pageable);

    Page<User> findByActiveTrue(Pageable pageable);

    @Query("{'$or': [" +
            "{'name':  {'$regex': ?0, '$options': 'i'}}," +
            "{'email': {'$regex': ?0, '$options': 'i'}}]}")
    Page<User> searchUsers(String keyword, Pageable pageable);

    long countByRole(User.Role role);

    long countByActiveTrue();
}