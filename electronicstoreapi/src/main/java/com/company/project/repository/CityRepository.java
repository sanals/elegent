package com.company.project.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.company.project.entity.City;
import com.company.project.entity.State;

@Repository
public interface CityRepository extends JpaRepository<City, Long> {
    Optional<City> findByName(String name);

    List<City> findByState(State state);

    List<City> findByStateOrderByNameAsc(State state);

    List<City> findAllByOrderByNameAsc();

    Optional<City> findByNameAndState(String name, State state);

    boolean existsByNameAndState(String name, State state);
}