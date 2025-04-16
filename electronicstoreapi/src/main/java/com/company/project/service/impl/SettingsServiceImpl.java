package com.company.project.service.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.company.project.dto.request.HomepageSettingsRequest;
import com.company.project.dto.request.SettingsRequest;
import com.company.project.dto.response.HomepageSettingsResponse;
import com.company.project.dto.response.SettingsResponse;
import com.company.project.entity.Settings;
import com.company.project.exception.ResourceNotFoundException;
import com.company.project.repository.SettingsRepository;
import com.company.project.service.SettingsService;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class SettingsServiceImpl implements SettingsService {

    private final SettingsRepository settingsRepository;
    private final ObjectMapper objectMapper;

    private static final String HOMEPAGE_GROUP = "homepage";
    private static final String FEATURED_PRODUCTS_KEY = "homepage.featuredProductsCount";
    private static final String LATEST_PRODUCTS_KEY = "homepage.latestProductsCount";

    @Autowired
    public SettingsServiceImpl(SettingsRepository settingsRepository) {
        this.settingsRepository = settingsRepository;
        this.objectMapper = new ObjectMapper();
    }

    @Override
    @Transactional
    public SettingsResponse saveSetting(SettingsRequest request) {
        Settings settings = settingsRepository.findBySettingKey(request.getKey())
                .orElse(new Settings());

        settings.setSettingKey(request.getKey());
        settings.setSettingValue(request.getValue());
        settings.setSettingGroup(request.getGroup());
        settings.setDescription(request.getDescription());

        Settings savedSettings = settingsRepository.save(settings);
        return SettingsResponse.fromEntity(savedSettings);
    }

    @Override
    public SettingsResponse getSettingByKey(String key) {
        return settingsRepository.findBySettingKey(key)
                .map(SettingsResponse::fromEntity)
                .orElse(null);
    }

    @Override
    public List<SettingsResponse> getSettingsByGroup(String group) {
        return settingsRepository.findBySettingGroup(group).stream()
                .map(SettingsResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void deleteSetting(String key) {
        Settings settings = settingsRepository.findBySettingKey(key)
                .orElseThrow(() -> new ResourceNotFoundException("Setting not found with key: " + key));

        settingsRepository.delete(settings);
    }

    @Override
    @Transactional
    public HomepageSettingsResponse saveHomepageSettings(HomepageSettingsRequest request) {
        // Save featured products count
        SettingsRequest featuredRequest = new SettingsRequest();
        featuredRequest.setKey(FEATURED_PRODUCTS_KEY);
        featuredRequest.setValue(String.valueOf(request.getFeaturedProductsCount()));
        featuredRequest.setGroup(HOMEPAGE_GROUP);
        featuredRequest.setDescription("Number of featured products to display on homepage");
        saveSetting(featuredRequest);

        // Save latest products count
        SettingsRequest latestRequest = new SettingsRequest();
        latestRequest.setKey(LATEST_PRODUCTS_KEY);
        latestRequest.setValue(String.valueOf(request.getLatestProductsCount()));
        latestRequest.setGroup(HOMEPAGE_GROUP);
        latestRequest.setDescription("Number of latest products to display on homepage");
        saveSetting(latestRequest);

        return new HomepageSettingsResponse(
                request.getFeaturedProductsCount(),
                request.getLatestProductsCount());
    }

    @Override
    public HomepageSettingsResponse getHomepageSettings() {
        // Get featured products count
        SettingsResponse featuredSetting = getSettingByKey(FEATURED_PRODUCTS_KEY);
        int featuredCount = featuredSetting != null ? Integer.parseInt(featuredSetting.getValue()) : 5; // Default to 5

        // Get latest products count
        SettingsResponse latestSetting = getSettingByKey(LATEST_PRODUCTS_KEY);
        int latestCount = latestSetting != null ? Integer.parseInt(latestSetting.getValue()) : 10; // Default to 10

        return new HomepageSettingsResponse(featuredCount, latestCount);
    }
}