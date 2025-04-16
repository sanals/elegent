package com.company.project.service;

import java.util.List;

import com.company.project.dto.request.HomepageSettingsRequest;
import com.company.project.dto.request.SettingsRequest;
import com.company.project.dto.response.HomepageSettingsResponse;
import com.company.project.dto.response.SettingsResponse;

public interface SettingsService {

    /**
     * Save a setting value
     * 
     * @param request Setting request
     * @return Setting response
     */
    SettingsResponse saveSetting(SettingsRequest request);

    /**
     * Get a setting by key
     * 
     * @param key Setting key
     * @return Setting response or null if not found
     */
    SettingsResponse getSettingByKey(String key);

    /**
     * Get all settings in a group
     * 
     * @param group Group name
     * @return List of settings
     */
    List<SettingsResponse> getSettingsByGroup(String group);

    /**
     * Delete a setting
     * 
     * @param key Setting key
     */
    void deleteSetting(String key);

    /**
     * Save homepage settings
     * 
     * @param request Homepage settings request
     * @return Homepage settings response
     */
    HomepageSettingsResponse saveHomepageSettings(HomepageSettingsRequest request);

    /**
     * Get homepage settings
     * 
     * @return Homepage settings response
     */
    HomepageSettingsResponse getHomepageSettings();
}