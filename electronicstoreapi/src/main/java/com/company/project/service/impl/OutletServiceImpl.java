package com.company.project.service.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.company.project.dto.request.OutletRequest;
import com.company.project.dto.response.CityResponse;
import com.company.project.dto.response.LocalityResponse;
import com.company.project.dto.response.OutletResponse;
import com.company.project.dto.response.StateResponse;
import com.company.project.entity.Locality;
import com.company.project.entity.Outlet;
import com.company.project.exception.ResourceNotFoundException;
import com.company.project.repository.LocalityRepository;
import com.company.project.repository.OutletRepository;
import com.company.project.service.OutletService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class OutletServiceImpl implements OutletService {

    private final OutletRepository outletRepository;
    private final LocalityRepository localityRepository;

    @Override
    public OutletResponse createOutlet(OutletRequest request) {
        Locality locality = localityRepository.findById(request.getLocalityId())
                .orElseThrow(
                        () -> new ResourceNotFoundException("Locality not found with id: " + request.getLocalityId()));

        Outlet outlet = new Outlet();
        outlet.setName(request.getName());
        outlet.setAddress(request.getAddress());
        outlet.setContactNumber(request.getContactNumber());
        outlet.setEmail(request.getEmail());
        outlet.setOpeningTime(request.getOpeningTime());
        outlet.setClosingTime(request.getClosingTime());
        outlet.setActive(request.isActive());
        outlet.setLocality(locality);

        Outlet savedOutlet = outletRepository.save(outlet);
        return mapToOutletResponse(savedOutlet);
    }

    @Override
    public OutletResponse updateOutlet(Long id, OutletRequest request) {
        Outlet outlet = outletRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Outlet not found with id: " + id));

        Locality locality = localityRepository.findById(request.getLocalityId())
                .orElseThrow(
                        () -> new ResourceNotFoundException("Locality not found with id: " + request.getLocalityId()));

        outlet.setName(request.getName());
        outlet.setAddress(request.getAddress());
        outlet.setContactNumber(request.getContactNumber());
        outlet.setEmail(request.getEmail());
        outlet.setOpeningTime(request.getOpeningTime());
        outlet.setClosingTime(request.getClosingTime());
        outlet.setActive(request.isActive());
        outlet.setLocality(locality);

        Outlet updatedOutlet = outletRepository.save(outlet);
        return mapToOutletResponse(updatedOutlet);
    }

    @Override
    public OutletResponse getOutletById(Long id) {
        Outlet outlet = outletRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Outlet not found with id: " + id));
        return mapToOutletResponse(outlet);
    }

    @Override
    public void deleteOutlet(Long id) {
        Outlet outlet = outletRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Outlet not found with id: " + id));
        // Soft delete
        outlet.setActive(false);
        outletRepository.save(outlet);
    }

    @Override
    public List<OutletResponse> getAllActiveOutlets() {
        List<Outlet> outlets = outletRepository.findByActiveTrue();
        return outlets.stream()
                .map(this::mapToOutletResponse)
                .collect(Collectors.toList());
    }

    @Override
    public Page<OutletResponse> getAllOutlets(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("name").ascending());
        Page<Outlet> outletPage = outletRepository.findAll(pageable);

        return outletPage.map(this::mapToOutletResponse);
    }

    @Override
    public List<OutletResponse> getOutletsByLocalityId(Long localityId) {
        Locality locality = localityRepository.findById(localityId)
                .orElseThrow(() -> new ResourceNotFoundException("Locality not found with id: " + localityId));

        List<Outlet> outlets = outletRepository.findByLocalityAndActiveTrue(locality);
        return outlets.stream()
                .map(this::mapToOutletResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<OutletResponse> getOutletsByCityId(Long cityId) {
        List<Outlet> outlets = outletRepository.findByLocality_City_IdAndActiveTrue(cityId);
        return outlets.stream()
                .map(this::mapToOutletResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<OutletResponse> getOutletsByStateId(Long stateId) {
        List<Outlet> outlets = outletRepository.findByLocality_City_State_IdAndActiveTrue(stateId);
        return outlets.stream()
                .map(this::mapToOutletResponse)
                .collect(Collectors.toList());
    }

    /**
     * Map Outlet entity to OutletResponse DTO
     * 
     * @param outlet the outlet entity
     * @return the outlet response DTO
     */
    private OutletResponse mapToOutletResponse(Outlet outlet) {
        OutletResponse response = new OutletResponse();
        response.setId(outlet.getId());
        response.setName(outlet.getName());
        response.setAddress(outlet.getAddress());
        response.setContactNumber(outlet.getContactNumber());
        response.setEmail(outlet.getEmail());
        response.setOpeningTime(outlet.getOpeningTime());
        response.setClosingTime(outlet.getClosingTime());
        response.setActive(outlet.isActive());

        // Set locality details
        Locality locality = outlet.getLocality();
        LocalityResponse localityResponse = new LocalityResponse();
        localityResponse.setId(locality.getId());
        localityResponse.setName(locality.getName());
        localityResponse.setPincode(locality.getPincode());

        CityResponse cityResponse = new CityResponse();
        cityResponse.setId(locality.getCity().getId());
        cityResponse.setName(locality.getCity().getName());

        StateResponse stateResponse = new StateResponse();
        stateResponse.setId(locality.getCity().getState().getId());
        stateResponse.setName(locality.getCity().getState().getName());

        cityResponse.setState(stateResponse);
        localityResponse.setCity(cityResponse);
        response.setLocality(localityResponse);
        response.setCity(cityResponse);
        response.setState(stateResponse);

        return response;
    }
}