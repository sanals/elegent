package com.company.project.service.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.company.project.dto.request.AddressRequest;
import com.company.project.dto.response.AddressResponse;
import com.company.project.entity.Address;
import com.company.project.entity.Locality;
import com.company.project.entity.User;
import com.company.project.exception.ResourceNotFoundException;
import com.company.project.repository.AddressRepository;
import com.company.project.repository.LocalityRepository;
import com.company.project.repository.UserRepository;
import com.company.project.service.AddressService;

@Service
public class AddressServiceImpl implements AddressService {

    private final AddressRepository addressRepository;
    private final UserRepository userRepository;
    private final LocalityRepository localityRepository;

    @Autowired
    public AddressServiceImpl(
            AddressRepository addressRepository,
            UserRepository userRepository,
            LocalityRepository localityRepository) {
        this.addressRepository = addressRepository;
        this.userRepository = userRepository;
        this.localityRepository = localityRepository;
    }

    @Override
    public List<AddressResponse> getUserAddresses(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + userId));

        List<Address> addresses = addressRepository.findByUser(user);
        return addresses.stream()
                .map(this::mapToAddressResponse)
                .collect(Collectors.toList());
    }

    @Override
    public AddressResponse getAddressById(Long addressId) {
        Address address = addressRepository.findById(addressId)
                .orElseThrow(() -> new ResourceNotFoundException("Address not found with ID: " + addressId));

        return mapToAddressResponse(address);
    }

    @Override
    @Transactional
    public AddressResponse createAddress(Long userId, AddressRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + userId));

        Locality locality = localityRepository.findById(request.getLocalityId())
                .orElseThrow(
                        () -> new ResourceNotFoundException("Locality not found with ID: " + request.getLocalityId()));

        // If this is set as default, unset any existing default address
        if (request.isDefault()) {
            addressRepository.findByUserAndIsDefaultTrue(user)
                    .ifPresent(defaultAddress -> {
                        defaultAddress.setDefault(false);
                        addressRepository.save(defaultAddress);
                    });
        }

        // If this is the first address for the user, make it default regardless of
        // input
        boolean shouldBeDefault = request.isDefault() ||
                addressRepository.countByUserId(userId) == 0;

        Address address = Address.builder()
                .addressLine1(request.getAddressLine1())
                .addressLine2(request.getAddressLine2())
                .landmark(request.getLandmark())
                .locality(locality)
                .user(user)
                .isDefault(shouldBeDefault)
                .contactName(request.getContactName())
                .contactPhone(request.getContactPhone())
                .addressType(request.getAddressType())
                .build();

        Address savedAddress = addressRepository.save(address);
        return mapToAddressResponse(savedAddress);
    }

    @Override
    @Transactional
    public AddressResponse updateAddress(Long addressId, AddressRequest request) {
        Address address = addressRepository.findById(addressId)
                .orElseThrow(() -> new ResourceNotFoundException("Address not found with ID: " + addressId));

        Locality locality = localityRepository.findById(request.getLocalityId())
                .orElseThrow(
                        () -> new ResourceNotFoundException("Locality not found with ID: " + request.getLocalityId()));

        // If this is set as default and it's not already default, unset any existing
        // default address
        if (request.isDefault() && !address.isDefault()) {
            addressRepository.findByUserAndIsDefaultTrue(address.getUser())
                    .ifPresent(defaultAddress -> {
                        defaultAddress.setDefault(false);
                        addressRepository.save(defaultAddress);
                    });
        }

        address.setAddressLine1(request.getAddressLine1());
        address.setAddressLine2(request.getAddressLine2());
        address.setLandmark(request.getLandmark());
        address.setLocality(locality);
        address.setDefault(request.isDefault());
        address.setContactName(request.getContactName());
        address.setContactPhone(request.getContactPhone());
        address.setAddressType(request.getAddressType());

        Address updatedAddress = addressRepository.save(address);
        return mapToAddressResponse(updatedAddress);
    }

    @Override
    @Transactional
    public void deleteAddress(Long addressId) {
        Address address = addressRepository.findById(addressId)
                .orElseThrow(() -> new ResourceNotFoundException("Address not found with ID: " + addressId));

        boolean wasDefault = address.isDefault();
        User user = address.getUser();

        addressRepository.delete(address);

        // If we deleted the default address and there are other addresses, set one as
        // default
        if (wasDefault) {
            addressRepository.findByUser(user)
                    .stream()
                    .findFirst()
                    .ifPresent(newDefault -> {
                        newDefault.setDefault(true);
                        addressRepository.save(newDefault);
                    });
        }
    }

    @Override
    @Transactional
    public AddressResponse setDefaultAddress(Long addressId) {
        Address address = addressRepository.findById(addressId)
                .orElseThrow(() -> new ResourceNotFoundException("Address not found with ID: " + addressId));

        // If it's already the default, no need to update
        if (address.isDefault()) {
            return mapToAddressResponse(address);
        }

        // Unset any existing default address
        addressRepository.findByUserAndIsDefaultTrue(address.getUser())
                .ifPresent(defaultAddress -> {
                    defaultAddress.setDefault(false);
                    addressRepository.save(defaultAddress);
                });

        // Set the new default
        address.setDefault(true);
        Address updatedAddress = addressRepository.save(address);

        return mapToAddressResponse(updatedAddress);
    }

    @Override
    public AddressResponse getDefaultAddress(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + userId));

        return addressRepository.findByUserAndIsDefaultTrue(user)
                .map(this::mapToAddressResponse)
                .orElse(null);
    }

    /**
     * Maps an Address entity to an AddressResponse DTO
     * 
     * @param address The address entity to map
     * @return The mapped AddressResponse
     */
    private AddressResponse mapToAddressResponse(Address address) {
        Locality locality = address.getLocality();

        StringBuilder formattedAddressBuilder = new StringBuilder();
        formattedAddressBuilder.append(address.getAddressLine1());

        if (address.getAddressLine2() != null && !address.getAddressLine2().isEmpty()) {
            formattedAddressBuilder.append(", ").append(address.getAddressLine2());
        }

        if (address.getLandmark() != null && !address.getLandmark().isEmpty()) {
            formattedAddressBuilder.append(", Near ").append(address.getLandmark());
        }

        formattedAddressBuilder.append(", ").append(locality.getName());
        formattedAddressBuilder.append(", ").append(locality.getCity().getName());
        formattedAddressBuilder.append(", ").append(locality.getCity().getState().getName());
        formattedAddressBuilder.append(" - ").append(locality.getPincode());

        return AddressResponse.builder()
                .id(address.getId())
                .addressLine1(address.getAddressLine1())
                .addressLine2(address.getAddressLine2())
                .landmark(address.getLandmark())
                .contactName(address.getContactName())
                .contactPhone(address.getContactPhone())
                .isDefault(address.isDefault())
                .addressType(address.getAddressType())
                .localityId(locality.getId())
                .localityName(locality.getName())
                .pincode(locality.getPincode())
                .cityId(locality.getCity().getId())
                .cityName(locality.getCity().getName())
                .stateId(locality.getCity().getState().getId())
                .stateName(locality.getCity().getState().getName())
                .formattedAddress(formattedAddressBuilder.toString())
                .build();
    }
}