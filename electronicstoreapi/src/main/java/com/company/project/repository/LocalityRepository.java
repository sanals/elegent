package com.company.project.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.company.project.entity.City;
import com.company.project.entity.Locality;

@Repository
public interface LocalityRepository extends JpaRepository<Locality, Long> {
    Optional<Locality> findByName(String name);

    List<Locality> findByCity(City city);

    List<Locality> findByCityOrderByNameAsc(City city);

    List<Locality> findAllByOrderByNameAsc();

    Optional<Locality> findByNameAndCity(String name, City city);

    boolean existsByNameAndCity(String name, City city);
}