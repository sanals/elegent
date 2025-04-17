package com.company.project.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.company.project.entity.Locality;
import com.company.project.entity.Outlet;

@Repository
public interface OutletRepository extends JpaRepository<Outlet, Long> {
    List<Outlet> findByLocalityAndActiveTrue(Locality locality);

    List<Outlet> findByLocality_City_IdAndActiveTrue(Long cityId);

    List<Outlet> findByLocality_City_State_IdAndActiveTrue(Long stateId);

    List<Outlet> findByActiveTrue();

    Page<Outlet> findAll(Pageable pageable);
}