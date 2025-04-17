package com.company.project.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.company.project.dto.request.AddressRequest;
import com.company.project.dto.response.AddressResponse;
import com.company.project.dto.response.ApiResponse;
import com.company.project.service.AddressService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/users/{userId}/addresses")
public class AddressController {

    private final AddressService addressService;

    @Autowired
    public AddressController(AddressService addressService) {
        this.addressService = addressService;
    }

    /**
     * Get all addresses for a user
     * 
     * @param userId ID of the user
     * @return API response with list of addresses
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<AddressResponse>>> getUserAddresses(@PathVariable Long userId) {
        List<AddressResponse> addresses = addressService.getUserAddresses(userId);
        return ResponseEntity.ok(
                ApiResponse.success(addresses, "Addresses retrieved successfully"));
    }

    /**
     * Get a specific address by ID
     * 
     * @param userId    ID of the user (for validation)
     * @param addressId ID of the address
     * @return API response with address details
     */
    @GetMapping("/{addressId}")
    public ResponseEntity<ApiResponse<AddressResponse>> getAddressById(
            @PathVariable Long userId,
            @PathVariable Long addressId) {

        AddressResponse address = addressService.getAddressById(addressId);
        return ResponseEntity.ok(
                ApiResponse.success(address, "Address retrieved successfully"));
    }

    /**
     * Create a new address for a user
     * 
     * @param userId  ID of the user
     * @param request Address details
     * @return API response with created address
     */
    @PostMapping
    public ResponseEntity<ApiResponse<AddressResponse>> createAddress(
            @PathVariable Long userId,
            @Valid @RequestBody AddressRequest request) {

        AddressResponse createdAddress = addressService.createAddress(userId, request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(createdAddress, "Address created successfully"));
    }

    /**
     * Update an existing address
     * 
     * @param userId    ID of the user (for validation)
     * @param addressId ID of the address to update
     * @param request   New address details
     * @return API response with updated address
     */
    @PutMapping("/{addressId}")
    public ResponseEntity<ApiResponse<AddressResponse>> updateAddress(
            @PathVariable Long userId,
            @PathVariable Long addressId,
            @Valid @RequestBody AddressRequest request) {

        AddressResponse updatedAddress = addressService.updateAddress(addressId, request);
        return ResponseEntity.ok(
                ApiResponse.success(updatedAddress, "Address updated successfully"));
    }

    /**
     * Delete an address
     * 
     * @param userId    ID of the user (for validation)
     * @param addressId ID of the address to delete
     * @return API response with success message
     */
    @DeleteMapping("/{addressId}")
    public ResponseEntity<ApiResponse<Void>> deleteAddress(
            @PathVariable Long userId,
            @PathVariable Long addressId) {

        addressService.deleteAddress(addressId);
        return ResponseEntity.ok(
                ApiResponse.success(null, "Address deleted successfully"));
    }

    /**
     * Set an address as the default address for a user
     * 
     * @param userId    ID of the user (for validation)
     * @param addressId ID of the address to set as default
     * @return API response with updated address
     */
    @PutMapping("/{addressId}/default")
    public ResponseEntity<ApiResponse<AddressResponse>> setDefaultAddress(
            @PathVariable Long userId,
            @PathVariable Long addressId) {

        AddressResponse updatedAddress = addressService.setDefaultAddress(addressId);
        return ResponseEntity.ok(
                ApiResponse.success(updatedAddress, "Address set as default successfully"));
    }

    /**
     * Get the default address for a user
     * 
     * @param userId ID of the user
     * @return API response with default address or null
     */
    @GetMapping("/default")
    public ResponseEntity<ApiResponse<AddressResponse>> getDefaultAddress(@PathVariable Long userId) {
        AddressResponse defaultAddress = addressService.getDefaultAddress(userId);

        if (defaultAddress != null) {
            return ResponseEntity.ok(
                    ApiResponse.success(defaultAddress, "Default address retrieved successfully"));
        } else {
            return ResponseEntity.ok(
                    ApiResponse.success(null, "No default address found"));
        }
    }
}