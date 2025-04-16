package com.company.project.service;

import java.util.List;

import com.company.project.dto.request.StateRequest;
import com.company.project.dto.response.StateResponse;
import com.company.project.exception.ResourceNotFoundException;

public interface StateService {

    /**
     * Get all states
     * 
     * @return List of state responses
     */
    List<StateResponse> getAllStates();

    /**
     * Get a state by ID
     * 
     * @param id State ID
     * @return State response
     * @throws ResourceNotFoundException if state not found
     */
    StateResponse getStateById(Long id);

    /**
     * Create a new state
     * 
     * @param stateRequest State data
     * @return Created state response
     */
    StateResponse createState(StateRequest stateRequest);
}