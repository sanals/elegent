package com.company.project.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.company.project.entity.Address;
import com.company.project.entity.User;

@Repository
public interface AddressRepository extends JpaRepository<Address, Long> {

    /**
     * Find all addresses for a specific user
     * 
     * @param user the user whose addresses to find
     * @return list of addresses for the user
     */
    List<Address> findByUser(User user);

    /**
     * Find all addresses for a user ID
     * 
     * @param userId the ID of the user whose addresses to find
     * @return list of addresses for the user
     */
    List<Address> findByUserId(Long userId);

    /**
     * Find the default address for a specific user
     * 
     * @param user the user whose default address to find
     * @return optional containing the default address if found
     */
    Optional<Address> findByUserAndIsDefaultTrue(User user);

    /**
     * Find the default address for a user ID
     * 
     * @param userId the ID of the user whose default address to find
     * @return optional containing the default address if found
     */
    Optional<Address> findByUserIdAndIsDefaultTrue(Long userId);

    /**
     * Count how many addresses a user has
     * 
     * @param userId the ID of the user
     * @return the number of addresses for the user
     */
    long countByUserId(Long userId);
}