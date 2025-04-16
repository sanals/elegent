package com.company.project.controller;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.company.project.dto.request.OutletRequest;
import com.company.project.dto.response.ApiResponse;
import com.company.project.dto.response.OutletResponse;
import com.company.project.service.OutletService;
import com.company.project.util.AppConstants;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/outlets")
@RequiredArgsConstructor
public class OutletController {

        private final OutletService outletService;

        /**
         * Create a new outlet
         *
         * @param request outlet request data
         * @return created outlet
         */
        @PostMapping
        public ResponseEntity<ApiResponse<OutletResponse>> createOutlet(@Valid @RequestBody OutletRequest request) {
                OutletResponse created = outletService.createOutlet(request);
                return ResponseEntity.status(HttpStatus.CREATED).body(
                                new ApiResponse<>("SUCCESS", HttpStatus.CREATED.value(), "Outlet created successfully",
                                                created));
        }

        /**
         * Update an existing outlet
         *
         * @param id      outlet id
         * @param request updated outlet data
         * @return updated outlet
         */
        @PutMapping("/{id}")
        public ResponseEntity<ApiResponse<OutletResponse>> updateOutlet(
                        @PathVariable Long id,
                        @Valid @RequestBody OutletRequest request) {
                OutletResponse updated = outletService.updateOutlet(id, request);
                return ResponseEntity.ok(
                                new ApiResponse<>("SUCCESS", HttpStatus.OK.value(), "Outlet updated successfully",
                                                updated));
        }

        /**
         * Get outlet by id
         *
         * @param id outlet id
         * @return outlet
         */
        @GetMapping("/{id}")
        public ResponseEntity<ApiResponse<OutletResponse>> getOutletById(@PathVariable Long id) {
                OutletResponse outlet = outletService.getOutletById(id);
                return ResponseEntity.ok(
                                new ApiResponse<>("SUCCESS", HttpStatus.OK.value(), "Outlet retrieved successfully",
                                                outlet));
        }

        /**
         * Delete an outlet
         *
         * @param id outlet id
         * @return success message
         */
        @DeleteMapping("/{id}")
        public ResponseEntity<ApiResponse<Void>> deleteOutlet(@PathVariable Long id) {
                outletService.deleteOutlet(id);
                return ResponseEntity.ok(
                                new ApiResponse<>("SUCCESS", HttpStatus.OK.value(), "Outlet deleted successfully",
                                                null));
        }

        /**
         * Get all active outlets
         *
         * @return list of active outlets
         */
        @GetMapping("/active")
        public ResponseEntity<ApiResponse<List<OutletResponse>>> getAllActiveOutlets() {
                List<OutletResponse> outlets = outletService.getAllActiveOutlets();
                return ResponseEntity.ok(
                                new ApiResponse<>("SUCCESS", HttpStatus.OK.value(),
                                                "Active outlets retrieved successfully", outlets));
        }

        /**
         * Get all outlets with pagination
         *
         * @param page page number
         * @param size page size
         * @return paged list of outlets
         */
        @GetMapping
        public ResponseEntity<ApiResponse<Page<OutletResponse>>> getAllOutlets(
                        @RequestParam(defaultValue = AppConstants.DEFAULT_PAGE_NUMBER) int page,
                        @RequestParam(defaultValue = AppConstants.DEFAULT_PAGE_SIZE) int size) {
                Page<OutletResponse> outlets = outletService.getAllOutlets(page, size);
                return ResponseEntity.ok(
                                new ApiResponse<>("SUCCESS", HttpStatus.OK.value(), "Outlets retrieved successfully",
                                                outlets));
        }

        /**
         * Get outlets by locality id
         *
         * @param localityId locality id
         * @return list of outlets in the locality
         */
        @GetMapping("/by-locality/{localityId}")
        public ResponseEntity<ApiResponse<List<OutletResponse>>> getOutletsByLocalityId(@PathVariable Long localityId) {
                List<OutletResponse> outlets = outletService.getOutletsByLocalityId(localityId);
                return ResponseEntity.ok(
                                new ApiResponse<>("SUCCESS", HttpStatus.OK.value(),
                                                "Outlets by locality retrieved successfully",
                                                outlets));
        }

        /**
         * Get outlets by city id
         *
         * @param cityId city id
         * @return list of outlets in the city
         */
        @GetMapping("/by-city/{cityId}")
        public ResponseEntity<ApiResponse<List<OutletResponse>>> getOutletsByCityId(@PathVariable Long cityId) {
                List<OutletResponse> outlets = outletService.getOutletsByCityId(cityId);
                return ResponseEntity.ok(
                                new ApiResponse<>("SUCCESS", HttpStatus.OK.value(),
                                                "Outlets by city retrieved successfully", outlets));
        }

        /**
         * Get outlets by state id
         *
         * @param stateId state id
         * @return list of outlets in the state
         */
        @GetMapping("/by-state/{stateId}")
        public ResponseEntity<ApiResponse<List<OutletResponse>>> getOutletsByStateId(@PathVariable Long stateId) {
                List<OutletResponse> outlets = outletService.getOutletsByStateId(stateId);
                return ResponseEntity.ok(
                                new ApiResponse<>("SUCCESS", HttpStatus.OK.value(),
                                                "Outlets by state retrieved successfully",
                                                outlets));
        }
}