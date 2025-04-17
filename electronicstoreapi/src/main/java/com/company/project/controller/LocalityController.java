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
import com.company.project.dto.response.LocalityResponse;
import com.company.project.dto.response.StateResponse;
import com.company.project.entity.City;
import com.company.project.entity.Locality;
import com.company.project.exception.ResourceNotFoundException;
import com.company.project.repository.CityRepository;
import com.company.project.repository.LocalityRepository;

@RestController
@RequestMapping("/localities")
public class LocalityController {

    @Autowired
    private LocalityRepository localityRepository;

    @Autowired
    private CityRepository cityRepository;

    /**
     * Get all localities
     * 
     * @return list of all localities
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<LocalityResponse>>> getAllLocalities() {
        List<Locality> localities = localityRepository.findAll();
        List<LocalityResponse> localityResponses = localities.stream()
                .map(this::mapToLocalityResponse)
                .collect(Collectors.toList());

        return ResponseEntity.ok(
                new ApiResponse<>("SUCCESS", HttpStatus.OK.value(), "Localities retrieved successfully",
                        localityResponses));
    }

    /**
     * Get locality by id
     * 
     * @param id locality id
     * @return locality details
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<LocalityResponse>> getLocalityById(@PathVariable Long id) {
        Locality locality = localityRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Locality not found with id: " + id));

        LocalityResponse localityResponse = mapToLocalityResponse(locality);

        return ResponseEntity.ok(
                new ApiResponse<>("SUCCESS", HttpStatus.OK.value(), "Locality retrieved successfully",
                        localityResponse));
    }

    /**
     * Get localities by city id
     * 
     * @param cityId city id
     * @return list of localities in the city
     */
    @GetMapping("/by-city/{cityId}")
    public ResponseEntity<ApiResponse<List<LocalityResponse>>> getLocalitiesByCity(@PathVariable Long cityId) {
        City city = cityRepository.findById(cityId)
                .orElseThrow(() -> new ResourceNotFoundException("City not found with id: " + cityId));

        List<Locality> localities = localityRepository.findByCity(city);
        List<LocalityResponse> localityResponses = localities.stream()
                .map(this::mapToLocalityResponse)
                .collect(Collectors.toList());

        return ResponseEntity.ok(
                new ApiResponse<>("SUCCESS", HttpStatus.OK.value(), "Localities by city retrieved successfully",
                        localityResponses));
    }

    /**
     * Create a new locality
     * 
     * @param localityRequest locality data
     * @return created locality
     */
    @PostMapping
    public ResponseEntity<ApiResponse<LocalityResponse>> createLocality(@RequestBody LocalityRequest localityRequest) {
        // Get the city
        City city = cityRepository.findById(localityRequest.getCityId())
                .orElseThrow(
                        () -> new ResourceNotFoundException("City not found with id: " + localityRequest.getCityId()));

        // Check if locality already exists in this city
        if (localityRepository.existsByNameAndCity(localityRequest.getName(), city)) {
            return ResponseEntity.badRequest().body(
                    new ApiResponse<>("ERROR", HttpStatus.BAD_REQUEST.value(),
                            "Locality with this name already exists in the city", null));
        }

        Locality locality = new Locality();
        locality.setName(localityRequest.getName());
        locality.setPincode(localityRequest.getPincode());
        locality.setCity(city);

        Locality savedLocality = localityRepository.save(locality);
        LocalityResponse localityResponse = mapToLocalityResponse(savedLocality);

        return ResponseEntity.status(HttpStatus.CREATED).body(
                new ApiResponse<>("SUCCESS", HttpStatus.CREATED.value(), "Locality created successfully",
                        localityResponse));
    }

    /**
     * Map Locality entity to LocalityResponse DTO
     * 
     * @param locality the locality entity
     * @return the locality response DTO
     */
    private LocalityResponse mapToLocalityResponse(Locality locality) {
        LocalityResponse response = new LocalityResponse();
        response.setId(locality.getId());
        response.setName(locality.getName());
        response.setPincode(locality.getPincode());

        CityResponse cityResponse = new CityResponse();
        cityResponse.setId(locality.getCity().getId());
        cityResponse.setName(locality.getCity().getName());

        StateResponse stateResponse = new StateResponse();
        stateResponse.setId(locality.getCity().getState().getId());
        stateResponse.setName(locality.getCity().getState().getName());
        cityResponse.setState(stateResponse);

        response.setCity(cityResponse);

        return response;
    }

    /**
     * Request DTO for creating a locality
     */
    public static class LocalityRequest {
        private String name;
        private String pincode;
        private Long cityId;

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public String getPincode() {
            return pincode;
        }

        public void setPincode(String pincode) {
            this.pincode = pincode;
        }

        public Long getCityId() {
            return cityId;
        }

        public void setCityId(Long cityId) {
            this.cityId = cityId;
        }
    }
}