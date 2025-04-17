package com.company.project.service;

import java.util.List;

import com.company.project.dto.request.AddressRequest;
import com.company.project.dto.response.AddressResponse;
import com.company.project.exception.ResourceNotFoundException;

public interface AddressService {

    /**
     * Get all addresses for a user
     * 
     * @param userId ID of the user
     * @return List of address responses
     * @throws ResourceNotFoundException if user not found
     */
    List<AddressResponse> getUserAddresses(Long userId);

    /**
     * Get a specific address by ID
     * 
     * @param addressId ID of the address
     * @return Address response
     * @throws ResourceNotFoundException if address not found
     */
    AddressResponse getAddressById(Long addressId);

    /**
     * Create a new address for a user
     * 
     * @param userId  ID of the user
     * @param request Address request data
     * @return Created address response
     * @throws ResourceNotFoundException if user or locality not found
     */
    AddressResponse createAddress(Long userId, AddressRequest request);

    /**
     * Update an existing address
     * 
     * @param addressId ID of the address to update
     * @param request   New address data
     * @return Updated address response
     * @throws ResourceNotFoundException if address or locality not found
     */
    AddressResponse updateAddress(Long addressId, AddressRequest request);

    /**
     * Delete an address
     * 
     * @param addressId ID of the address to delete
     * @throws ResourceNotFoundException if address not found
     */
    void deleteAddress(Long addressId);

    /**
     * Set an address as the default address for a user
     * 
     * @param addressId ID of the address to set as default
     * @return Updated address response
     * @throws ResourceNotFoundException if address not found
     */
    AddressResponse setDefaultAddress(Long addressId);

    /**
     * Get the default address for a user
     * 
     * @param userId ID of the user
     * @return Default address response or null if none set
     * @throws ResourceNotFoundException if user not found
     */
    AddressResponse getDefaultAddress(Long userId);
}