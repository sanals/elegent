package com.company.project.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.company.project.dto.request.StateRequest;
import com.company.project.dto.response.ApiResponse;
import com.company.project.dto.response.StateResponse;
import com.company.project.service.StateService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/states")
public class StateController {

    private final StateService stateService;

    @Autowired
    public StateController(StateService stateService) {
        this.stateService = stateService;
    }

    /**
     * Get all states
     * 
     * @return list of all states
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<StateResponse>>> getAllStates() {
        List<StateResponse> stateResponses = stateService.getAllStates();
        return ResponseEntity.ok(
                ApiResponse.success(stateResponses, "States retrieved successfully"));
    }

    /**
     * Get state by id
     * 
     * @param id state id
     * @return state details
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<StateResponse>> getStateById(@PathVariable Long id) {
        StateResponse stateResponse = stateService.getStateById(id);
        return ResponseEntity.ok(
                ApiResponse.success(stateResponse, "State retrieved successfully"));
    }

    /**
     * Create a new state
     * 
     * @param stateRequest state data
     * @return created state
     */
    @PostMapping
    public ResponseEntity<ApiResponse<StateResponse>> createState(@Valid @RequestBody StateRequest stateRequest) {
        try {
            StateResponse stateResponse = stateService.createState(stateRequest);
            return ResponseEntity.status(HttpStatus.CREATED).body(
                    ApiResponse.success(stateResponse, "State created successfully"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(
                    ApiResponse.error(HttpStatus.BAD_REQUEST.value(), e.getMessage()));
        }
    }
}