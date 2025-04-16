package com.company.project.service.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.company.project.dto.request.StateRequest;
import com.company.project.dto.response.StateResponse;
import com.company.project.entity.State;
import com.company.project.exception.ResourceNotFoundException;
import com.company.project.repository.StateRepository;
import com.company.project.service.StateService;

@Service
public class StateServiceImpl implements StateService {

    private final StateRepository stateRepository;

    @Autowired
    public StateServiceImpl(StateRepository stateRepository) {
        this.stateRepository = stateRepository;
    }

    @Override
    public List<StateResponse> getAllStates() {
        List<State> states = stateRepository.findAll();
        return states.stream()
                .map(this::mapToStateResponse)
                .collect(Collectors.toList());
    }

    @Override
    public StateResponse getStateById(Long id) {
        State state = stateRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("State not found with id: " + id));
        return mapToStateResponse(state);
    }

    @Override
    public StateResponse createState(StateRequest stateRequest) {
        // Check if state already exists
        if (stateRepository.existsByName(stateRequest.getName())) {
            throw new IllegalArgumentException("State with this name already exists");
        }

        State state = new State();
        state.setName(stateRequest.getName());
        state.setCode(stateRequest.getCode());

        State savedState = stateRepository.save(state);
        return mapToStateResponse(savedState);
    }

    /**
     * Maps a State entity to a StateResponse DTO
     * 
     * @param state The state entity
     * @return The mapped StateResponse
     */
    private StateResponse mapToStateResponse(State state) {
        StateResponse response = new StateResponse();
        response.setId(state.getId());
        response.setName(state.getName());
        return response;
    }
}