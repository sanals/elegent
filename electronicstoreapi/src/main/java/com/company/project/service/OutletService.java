package com.company.project.service;

import java.util.List;

import org.springframework.data.domain.Page;

import com.company.project.dto.request.OutletRequest;
import com.company.project.dto.response.OutletResponse;

public interface OutletService {

    /**
     * Create a new outlet
     * 
     * @param request the outlet data
     * @return the created outlet
     */
    OutletResponse createOutlet(OutletRequest request);

    /**
     * Update an existing outlet
     * 
     * @param id      the outlet id
     * @param request the updated outlet data
     * @return the updated outlet
     */
    OutletResponse updateOutlet(Long id, OutletRequest request);

    /**
     * Get an outlet by id
     * 
     * @param id the outlet id
     * @return the outlet
     */
    OutletResponse getOutletById(Long id);

    /**
     * Delete an outlet
     * 
     * @param id the outlet id
     */
    void deleteOutlet(Long id);

    /**
     * Get all active outlets
     * 
     * @return list of all active outlets
     */
    List<OutletResponse> getAllActiveOutlets();

    /**
     * Get all outlets with pagination
     * 
     * @param page the page number
     * @param size the page size
     * @return paged list of outlets
     */
    Page<OutletResponse> getAllOutlets(int page, int size);

    /**
     * Get outlets by locality id
     * 
     * @param localityId the locality id
     * @return list of outlets in the locality
     */
    List<OutletResponse> getOutletsByLocalityId(Long localityId);

    /**
     * Get outlets by city id
     * 
     * @param cityId the city id
     * @return list of outlets in the city
     */
    List<OutletResponse> getOutletsByCityId(Long cityId);

    /**
     * Get outlets by state id
     * 
     * @param stateId the state id
     * @return list of outlets in the state
     */
    List<OutletResponse> getOutletsByStateId(Long stateId);
}