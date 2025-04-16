package com.company.project.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.company.project.entity.Settings;

public interface SettingsRepository extends JpaRepository<Settings, Long> {

    Optional<Settings> findBySettingKey(String settingKey);

    List<Settings> findBySettingGroup(String settingGroup);

    boolean existsBySettingKey(String settingKey);
}