package com.company.project.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.company.project.dto.request.HomepageSettingsRequest;
import com.company.project.dto.request.SettingsRequest;
import com.company.project.dto.response.ApiResponse;
import com.company.project.dto.response.HomepageSettingsResponse;
import com.company.project.dto.response.SettingsResponse;
import com.company.project.service.SettingsService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/settings")
public class SettingsController {

    private final SettingsService settingsService;

    @Autowired
    public SettingsController(SettingsService settingsService) {
        this.settingsService = settingsService;
    }

    /**
     * Save a setting
     * 
     * @param request Setting request
     * @return API response with setting
     */
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<SettingsResponse> saveSetting(
            @Valid @RequestBody SettingsRequest request) {
        SettingsResponse response = settingsService.saveSetting(request);
        return new ApiResponse<>("SUCCESS", HttpStatus.OK.value(),
                "Setting saved successfully", response);
    }

    /**
     * Get a setting by key
     * 
     * @param key Setting key
     * @return API response with setting
     */
    @GetMapping("/{key}")
    public ApiResponse<SettingsResponse> getSettingByKey(@PathVariable String key) {
        SettingsResponse response = settingsService.getSettingByKey(key);
        return new ApiResponse<>("SUCCESS", HttpStatus.OK.value(),
                "Setting retrieved successfully", response);
    }

    /**
     * Get settings by group
     * 
     * @param group Group name
     * @return API response with settings list
     */
    @GetMapping
    public ApiResponse<List<SettingsResponse>> getSettingsByGroup(
            @RequestParam String group) {
        List<SettingsResponse> response = settingsService.getSettingsByGroup(group);
        return new ApiResponse<>("SUCCESS", HttpStatus.OK.value(),
                "Settings retrieved successfully", response);
    }

    /**
     * Delete a setting
     * 
     * @param key Setting key
     * @return API response
     */
    @DeleteMapping("/{key}")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<Void> deleteSetting(@PathVariable String key) {
        settingsService.deleteSetting(key);
        return new ApiResponse<>("SUCCESS", HttpStatus.OK.value(),
                "Setting deleted successfully", null);
    }

    /**
     * Save homepage settings
     * 
     * @param request Homepage settings request
     * @return API response with homepage settings
     */
    @PostMapping("/homepage")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<HomepageSettingsResponse> saveHomepageSettings(
            @Valid @RequestBody HomepageSettingsRequest request) {
        HomepageSettingsResponse response = settingsService.saveHomepageSettings(request);
        return new ApiResponse<>("SUCCESS", HttpStatus.OK.value(),
                "Homepage settings saved successfully", response);
    }

    /**
     * Get homepage settings
     * 
     * @return API response with homepage settings
     */
    @GetMapping("/homepage")
    public ApiResponse<HomepageSettingsResponse> getHomepageSettings() {
        HomepageSettingsResponse response = settingsService.getHomepageSettings();
        return new ApiResponse<>("SUCCESS", HttpStatus.OK.value(),
                "Homepage settings retrieved successfully", response);
    }
}