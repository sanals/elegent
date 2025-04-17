package com.company.project.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.company.project.dto.response.ApiResponse;
import com.company.project.dto.response.CityResponse;
import com.company.project.dto.response.StateResponse;
import com.company.project.entity.City;
import com.company.project.entity.State;
import com.company.project.exception.ResourceNotFoundException;
import com.company.project.repository.CityRepository;
import com.company.project.repository.StateRepository;

@RestController
@RequestMapping("/cities")
public class CityController {

    @Autowired
    private CityRepository cityRepository;

    @Autowired
    private StateRepository stateRepository;

    /**
     * Get all cities
     * 
     * @return list of all cities
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<CityResponse>>> getAllCities() {
        List<City> cities = cityRepository.findAll();
        List<CityResponse> cityResponses = cities.stream()
                .map(this::mapToCityResponse)
                .collect(Collectors.toList());

        return ResponseEntity.ok(
                new ApiResponse<>("SUCCESS", HttpStatus.OK.value(), "Cities retrieved successfully", cityResponses));
    }

    /**
     * Get city by id
     * 
     * @param id city id
     * @return city details
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<CityResponse>> getCityById(@PathVariable Long id) {
        City city = cityRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("City not found with id: " + id));

        CityResponse cityResponse = mapToCityResponse(city);

        return ResponseEntity.ok(
                new ApiResponse<>("SUCCESS", HttpStatus.OK.value(), "City retrieved successfully", cityResponse));
    }

    /**
     * Get cities by state id
     * 
     * @param stateId state id
     * @return list of cities in the state
     */
    @GetMapping("/by-state/{stateId}")
    public ResponseEntity<ApiResponse<List<CityResponse>>> getCitiesByState(@PathVariable Long stateId) {
        State state = stateRepository.findById(stateId)
                .orElseThrow(() -> new ResourceNotFoundException("State not found with id: " + stateId));

        List<City> cities = cityRepository.findByState(state);
        List<CityResponse> cityResponses = cities.stream()
                .map(this::mapToCityResponse)
                .collect(Collectors.toList());

        return ResponseEntity.ok(
                new ApiResponse<>("SUCCESS", HttpStatus.OK.value(), "Cities by state retrieved successfully",
                        cityResponses));
    }

    /**
     * Create a new city
     * 
     * @param cityRequest city data
     * @return created city
     */
    @PostMapping
    public ResponseEntity<ApiResponse<CityResponse>> createCity(@RequestBody CityRequest cityRequest) {
        // Get the state
        State state = stateRepository.findById(cityRequest.getStateId())
                .orElseThrow(
                        () -> new ResourceNotFoundException("State not found with id: " + cityRequest.getStateId()));

        // Check if city already exists in this state
        if (cityRepository.existsByNameAndState(cityRequest.getName(), state)) {
            return ResponseEntity.badRequest().body(
                    new ApiResponse<>("ERROR", HttpStatus.BAD_REQUEST.value(),
                            "City with this name already exists in the state", null));
        }

        City city = new City();
        city.setName(cityRequest.getName());
        city.setState(state);

        City savedCity = cityRepository.save(city);
        CityResponse cityResponse = mapToCityResponse(savedCity);

        return ResponseEntity.status(HttpStatus.CREATED).body(
                new ApiResponse<>("SUCCESS", HttpStatus.CREATED.value(), "City created successfully", cityResponse));
    }

    /**
     * Map City entity to CityResponse DTO
     * 
     * @param city the city entity
     * @return the city response DTO
     */
    private CityResponse mapToCityResponse(City city) {
        CityResponse response = new CityResponse();
        response.setId(city.getId());
        response.setName(city.getName());

        StateResponse stateResponse = new StateResponse();
        stateResponse.setId(city.getState().getId());
        stateResponse.setName(city.getState().getName());
        response.setState(stateResponse);

        return response;
    }

    /**
     * Request DTO for creating a city
     */
    public static class CityRequest {
        private String name;
        private Long stateId;

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public Long getStateId() {
            return stateId;
        }

        public void setStateId(Long stateId) {
            this.stateId = stateId;
        }
    }
}