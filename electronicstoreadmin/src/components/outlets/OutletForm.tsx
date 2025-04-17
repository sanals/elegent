import {
  Add as AddIcon,
  ArrowBack as ArrowBackIcon,
  EditLocationAlt as EditLocationIcon,
  LocationOn as LocationIcon,
  Map as MapIcon,
} from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LocationService } from '../../services/location.service';
import { OutletService } from '../../services/outlet.service';
import {
  CityResponse,
  LocalityResponse,
  OutletCreateRequest,
  OutletResponse,
  StateResponse,
} from '../../types/api-responses';
import {
  createGoogleMapsUrl,
  fetchLocationNameFromCoordinates,
  loadGoogleMapsApi,
} from '../../utils/maps-utils';
import { showNotification } from '../../utils/notification';

// Google Maps types
declare global {
  interface Window {
    google: any;
    initMap: () => void;
  }
}

interface OutletFormProps {
  outletId?: number;
  initialData?: OutletResponse;
}

const OutletForm: React.FC<OutletFormProps> = ({ outletId, initialData }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isEditing = !!outletId;
  const mapRef = useRef<HTMLDivElement>(null);
  const [_mapInstance, setMapInstance] = useState<google.maps.Map | null>(null);
  const [marker, setMarker] = useState<google.maps.Marker | null>(null);

  // Define reusable styles as constants
  const addButtonStyle = {
    ml: 1,
    minWidth: theme.spacing(7), // 56px equivalent using theme spacing (assuming 8px base)
    height: theme.spacing(7),
    width: theme.spacing(7),
    borderRadius: 1, // Using theme.shape.borderRadius units (4px by default)
  };

  // Form state
  const [formData, setFormData] = useState<OutletCreateRequest>({
    name: '',
    address: '',
    contactNumber: '',
    email: '',
    openingTime: '',
    closingTime: '',
    localityId: 0,
    latitude: undefined,
    longitude: undefined,
    mapUrl: '',
    active: true,
  });

  // Add state for location description
  const [locationName, setLocationName] = useState<string>('');

  // Location state
  const [states, setStates] = useState<StateResponse[]>([]);
  const [cities, setCities] = useState<CityResponse[]>([]);
  const [localities, setLocalities] = useState<LocalityResponse[]>([]);
  const [selectedState, setSelectedState] = useState<StateResponse | null>(null);
  const [selectedCity, setSelectedCity] = useState<CityResponse | null>(null);
  const [selectedLocality, setSelectedLocality] = useState<LocalityResponse | null>(null);

  // Map dialog state
  const [mapDialogOpen, setMapDialogOpen] = useState(false);

  // Dialog state for creating new items
  const [newStateDialog, setNewStateDialog] = useState(false);
  const [newCityDialog, setNewCityDialog] = useState(false);
  const [newLocalityDialog, setNewLocalityDialog] = useState(false);
  const [newStateName, setNewStateName] = useState('');
  const [newCityName, setNewCityName] = useState('');
  const [newLocalityName, setNewLocalityName] = useState('');
  const [newLocalityPincode, setNewLocalityPincode] = useState('');

  // UI state
  const [loading, setLoading] = useState(false);
  const [fetchingLocations, setFetchingLocations] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);

  // Load initial data if editing
  useEffect(() => {
    if (initialData) {
      console.log('Loading initial outlet data:', initialData);

      // Ensure coordinates are numbers, not strings
      const latitude =
        typeof initialData.latitude === 'string'
          ? parseFloat(initialData.latitude)
          : initialData.latitude || 0; // Default to 0 if undefined

      const longitude =
        typeof initialData.longitude === 'string'
          ? parseFloat(initialData.longitude)
          : initialData.longitude || 0; // Default to 0 if undefined

      setFormData({
        name: initialData.name,
        address: initialData.address,
        contactNumber: initialData.contactNumber,
        email: initialData.email || '',
        openingTime: initialData.openingTime || '',
        closingTime: initialData.closingTime || '',
        localityId: initialData.locality.id,
        latitude,
        longitude,
        mapUrl:
          initialData.mapUrl ||
          (latitude && longitude ? createGoogleMapsUrl(latitude, longitude) : ''),
        active: initialData.active,
      });

      console.log('Set form data with coordinates:', latitude, longitude);

      // Get location name for the initial coordinates
      if (latitude && longitude) {
        fetchLocationNameFromCoordinates(latitude, longitude).then(locationName => {
          if (locationName) {
            setLocationName(locationName);
            console.log('Initial location name:', locationName);
          }
        });
      }

      // Set location information
      if (initialData.locality) {
        setSelectedLocality(initialData.locality);
      }

      if (initialData.city) {
        setSelectedCity(initialData.city);
      }

      if (initialData.state) {
        setSelectedState(initialData.state);
      }
    }
  }, [initialData]);

  // Initialize Google Maps
  const initializeMap = () => {
    if (!mapRef.current) return;

    // Default location - India (if no coordinates are provided)
    const center = {
      lat: formData.latitude || 20.5937,
      lng: formData.longitude || 78.9629,
    };

    console.log('Initializing map with center:', center);

    const map = new window.google.maps.Map(mapRef.current, {
      center,
      zoom: formData.latitude ? 15 : 5,
      mapTypeControl: true,
      streetViewControl: true,
    });

    setMapInstance(map);

    // Add marker if coordinates exist
    if (formData.latitude && formData.longitude) {
      console.log('Adding marker at:', formData.latitude, formData.longitude);
      const position = { lat: formData.latitude, lng: formData.longitude };
      const newMarker = new window.google.maps.Marker({
        position,
        map,
        draggable: true,
        title: formData.name,
      });

      setMarker(newMarker);

      // Update coordinates when marker is dragged
      newMarker.addListener('dragend', () => {
        const position = newMarker.getPosition();
        if (position) {
          updateCoordinates(position.lat(), position.lng());
        }
      });
    }

    // Add click listener to map
    map.addListener('click', (e: google.maps.MapMouseEvent) => {
      const position = e.latLng;
      if (position) {
        // Create marker if it doesn't exist, or move existing marker
        if (!marker) {
          const newMarker = new window.google.maps.Marker({
            position,
            map,
            draggable: true,
            title: formData.name,
          });

          setMarker(newMarker);

          newMarker.addListener('dragend', () => {
            const newPosition = newMarker.getPosition();
            if (newPosition) {
              updateCoordinates(newPosition.lat(), newPosition.lng());
            }
          });
        } else {
          marker.setPosition(position);
        }

        updateCoordinates(position.lat(), position.lng());
      }
    });
  };

  // Update coordinates and generate map URL
  const updateCoordinates = (lat: number, lng: number) => {
    // Ensure coordinates are numbers and properly formatted
    const numLat = Number(lat);
    const numLng = Number(lng);

    const mapUrl = createGoogleMapsUrl(numLat, numLng);
    setFormData(prev => ({
      ...prev,
      latitude: numLat,
      longitude: numLng,
      mapUrl,
    }));

    console.log('Updated coordinates:', numLat, numLng);

    // Fetch location name using our direct API function
    fetchLocationNameFromCoordinates(numLat, numLng).then(locationName => {
      if (locationName) {
        setLocationName(locationName);
        console.log('Location name:', locationName);
      }
    });
  };

  // Handle map dialog open
  const handleOpenMapDialog = () => {
    setMapDialogOpen(true);

    // Initialize map after dialog is open with a small delay
    setTimeout(() => {
      if (window.google) {
        initializeMap();
      } else {
        // If Google Maps API isn't loaded yet, wait for it
        loadGoogleMapsApi()
          .then(() => {
            initializeMap();
          })
          .catch(error => {
            console.error('Failed to load Google Maps in dialog:', error);
            setFormError('Failed to load Google Maps. Please refresh the page and try again.');
            setMapDialogOpen(false);
          });
      }
    }, 300);
  };

  // Handle map dialog close
  const handleCloseMapDialog = () => {
    setMapDialogOpen(false);
  };

  // Load states when component mounts
  useEffect(() => {
    const fetchStates = async () => {
      setFetchingLocations(true);
      try {
        const response = await LocationService.getAllStates();
        if (response.data) {
          setStates(response.data);
        }
      } catch (error) {
        console.error('Error fetching states:', error);
        setFormError('Failed to load states. Please try again.');
      } finally {
        setFetchingLocations(false);
      }
    };

    fetchStates();

    // Load Google Maps API
    loadGoogleMapsApi().catch(error => {
      console.error('Failed to load Google Maps:', error);
      setFormError('Failed to load Google Maps. Please refresh the page and try again.');
    });
  }, []);

  // Load cities when state changes
  useEffect(() => {
    if (selectedState) {
      const fetchCities = async () => {
        setFetchingLocations(true);
        setCities([]);
        setLocalities([]);
        setSelectedCity(null);
        setSelectedLocality(null);
        setFormData(prev => ({ ...prev, localityId: 0 }));

        try {
          const response = await LocationService.getCitiesByState(selectedState.id);
          if (response.data) {
            setCities(response.data);

            // If editing, restore the selected city if it's in the same state
            if (initialData?.city && initialData.state?.id === selectedState.id) {
              const city = response.data.find(c => c.id === initialData.city.id);
              if (city) {
                setSelectedCity(city);
              }
            }
          }
        } catch (error) {
          console.error('Error fetching cities:', error);
          setFormError('Failed to load cities. Please try again.');
        } finally {
          setFetchingLocations(false);
        }
      };

      fetchCities();
    }
  }, [selectedState, initialData]);

  // Load localities when city changes
  useEffect(() => {
    if (selectedCity) {
      const fetchLocalities = async () => {
        setFetchingLocations(true);
        setLocalities([]);
        setSelectedLocality(null);
        setFormData(prev => ({ ...prev, localityId: 0 }));

        try {
          const response = await LocationService.getLocalitiesByCity(selectedCity.id);
          if (response.data) {
            setLocalities(response.data);

            // If editing, restore the selected locality if it's in the same city
            if (initialData?.locality && initialData.city?.id === selectedCity.id) {
              const locality = response.data.find(l => l.id === initialData.locality.id);
              if (locality) {
                setSelectedLocality(locality);
                setFormData(prev => ({ ...prev, localityId: locality.id }));
              }
            }
          }
        } catch (error) {
          console.error('Error fetching localities:', error);
          setFormError('Failed to load localities. Please try again.');
        } finally {
          setFetchingLocations(false);
        }
      };

      fetchLocalities();
    }
  }, [selectedCity, initialData]);

  // Create new state
  const handleCreateState = async () => {
    if (!newStateName.trim()) {
      showNotification('State name is required', 'error');
      return;
    }

    setFetchingLocations(true);
    try {
      const response = await LocationService.createState({ name: newStateName });
      if (response.status === 'SUCCESS' && response.data) {
        const newState = response.data;
        setStates(prev => [...prev, newState]);
        setSelectedState(newState);
        setNewStateName('');
        setNewStateDialog(false);
        showNotification('State created successfully', 'success');
      } else {
        showNotification(response.message || 'Failed to create state', 'error');
      }
    } catch (error) {
      console.error('Error creating state:', error);
      showNotification('Failed to create state', 'error');
    } finally {
      setFetchingLocations(false);
    }
  };

  // Create new city
  const handleCreateCity = async () => {
    if (!newCityName.trim()) {
      showNotification('City name is required', 'error');
      return;
    }

    if (!selectedState) {
      showNotification('Please select a state first', 'error');
      return;
    }

    setFetchingLocations(true);
    try {
      const response = await LocationService.createCity({
        name: newCityName,
        stateId: selectedState.id,
      });

      if (response.status === 'SUCCESS' && response.data) {
        const newCity = response.data;
        setCities(prev => [...prev, newCity]);
        setSelectedCity(newCity);
        setNewCityName('');
        setNewCityDialog(false);
        showNotification('City created successfully', 'success');
      } else {
        showNotification(response.message || 'Failed to create city', 'error');
      }
    } catch (error) {
      console.error('Error creating city:', error);
      showNotification('Failed to create city', 'error');
    } finally {
      setFetchingLocations(false);
    }
  };

  // Create new locality
  const handleCreateLocality = async () => {
    if (!newLocalityName.trim()) {
      showNotification('Locality name is required', 'error');
      return;
    }

    if (!newLocalityPincode.trim()) {
      showNotification('Pincode is required', 'error');
      return;
    }

    if (!selectedCity) {
      showNotification('Please select a city first', 'error');
      return;
    }

    setFetchingLocations(true);
    try {
      const response = await LocationService.createLocality({
        name: newLocalityName,
        pincode: newLocalityPincode,
        cityId: selectedCity.id,
      });

      if (response.status === 'SUCCESS' && response.data) {
        const newLocality = response.data;
        setLocalities(prev => [...prev, newLocality]);
        setSelectedLocality(newLocality);
        setFormData(prev => ({ ...prev, localityId: newLocality.id }));
        setNewLocalityName('');
        setNewLocalityPincode('');
        setNewLocalityDialog(false);
        showNotification('Locality created successfully', 'success');
      } else {
        showNotification(response.message || 'Failed to create locality', 'error');
      }
    } catch (error) {
      console.error('Error creating locality:', error);
      showNotification('Failed to create locality', 'error');
    } finally {
      setFetchingLocations(false);
    }
  };

  // Handle input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name as string]: value }));

    // Clear field error when user edits the field
    if (errors[name as string]) {
      setErrors(prev => ({ ...prev, [name as string]: '' }));
    }
  };

  // Handle time changes
  const handleTimeChange = (time: Date | null, field: 'openingTime' | 'closingTime') => {
    if (time) {
      const timeString = time.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      });
      setFormData(prev => ({ ...prev, [field]: timeString }));
    } else {
      setFormData(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }

    if (!formData.contactNumber.trim()) {
      newErrors.contactNumber = 'Contact number is required';
    } else if (!/^\d{10}$/.test(formData.contactNumber.trim())) {
      newErrors.contactNumber = 'Contact number must be 10 digits';
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!formData.localityId || formData.localityId === 0) {
      newErrors.locality = 'Locality is required';
    }

    if (!formData.latitude || !formData.longitude) {
      newErrors.location = 'Please select a location on the map';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle locality selection
  const handleLocalityChange = (locality: LocalityResponse | null) => {
    setSelectedLocality(locality);
    if (locality) {
      setFormData(prev => ({ ...prev, localityId: locality.id }));
      // Clear locality error if it was previously set
      if (errors.localityId) {
        setErrors(prev => ({ ...prev, localityId: '' }));
      }
    } else {
      setFormData(prev => ({ ...prev, localityId: 0 }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setFormError(null);

    // Prepare data for submission - ensure proper types
    const submissionData = {
      ...formData,
      // Ensure coordinates are numbers
      latitude: formData.latitude ? Number(formData.latitude) : undefined,
      longitude: formData.longitude ? Number(formData.longitude) : undefined,
    };

    // Log the form data to debug
    console.log('Submitting outlet data:', submissionData);

    try {
      let response;

      if (isEditing && outletId) {
        response = await OutletService.updateOutlet(outletId, submissionData);
      } else {
        response = await OutletService.createOutlet(submissionData);
      }

      console.log('API response:', response);

      if (response.status === 'SUCCESS') {
        showNotification(`Outlet ${isEditing ? 'updated' : 'created'} successfully`, 'success');
        navigate('/outlets');
      } else {
        setFormError(response.message || 'Failed to save outlet');
      }
    } catch (error) {
      console.error('Error saving outlet:', error);
      setFormError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Box display="flex" alignItems="center" mb={3}>
        <IconButton component={Link} to="/outlets" color="inherit" sx={{ mr: 1 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" component="h1">
          {isEditing ? 'Edit Outlet' : 'Add New Outlet'}
        </Typography>
      </Box>

      {formError && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {formError}
        </Alert>
      )}

      <Card>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Outlet Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  fullWidth
                  required
                  error={!!errors.name}
                  helperText={errors.name}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  label="Contact Number"
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleChange}
                  fullWidth
                  required
                  error={!!errors.contactNumber}
                  helperText={errors.contactNumber}
                  inputProps={{ maxLength: 10 }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="Address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  fullWidth
                  required
                  multiline
                  rows={2}
                  error={!!errors.address}
                  helperText={errors.address}
                />
              </Grid>

              <Grid item xs={12}>
                <Box display="flex" alignItems="center" gap={2}>
                  <Button
                    variant="outlined"
                    color="primary"
                    startIcon={
                      formData.latitude && formData.longitude ? (
                        <EditLocationIcon />
                      ) : (
                        <LocationIcon />
                      )
                    }
                    onClick={handleOpenMapDialog}
                  >
                    {formData.latitude && formData.longitude
                      ? 'Update Location on Map'
                      : 'Select Location on Map'}
                  </Button>

                  {formData.latitude && formData.longitude && (
                    <Typography variant="body2" color="textSecondary">
                      {locationName
                        ? `Location: ${locationName}`
                        : `Location selected: ${formData.latitude.toFixed(6)}, ${formData.longitude.toFixed(6)}`}
                    </Typography>
                  )}
                </Box>

                {formData.mapUrl && (
                  <Box mt={1}>
                    <Button
                      component={Link}
                      to={formData.mapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      variant="text"
                      size="small"
                      startIcon={<MapIcon fontSize="small" />}
                      sx={{
                        color:
                          theme.palette.mode === 'dark' ? '#90caf9' : theme.palette.primary.main,
                        textDecoration: 'underline',
                        '&:hover': {
                          backgroundColor: 'transparent',
                          textDecoration: 'underline',
                        },
                        textTransform: 'none',
                        padding: '2px 8px',
                        minWidth: 0,
                      }}
                    >
                      View on Google Maps
                    </Button>
                  </Box>
                )}
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  label="Email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  fullWidth
                  error={!!errors.email}
                  helperText={errors.email}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                  <FormControl fullWidth>
                    <Autocomplete
                      options={states}
                      getOptionLabel={option => option.name}
                      value={selectedState}
                      onChange={(_, newValue) => setSelectedState(newValue)}
                      renderInput={params => (
                        <TextField {...params} label="State" disabled={fetchingLocations} />
                      )}
                      isOptionEqualToValue={(option, value) => option.id === value.id}
                      loading={fetchingLocations}
                      loadingText="Loading states..."
                      noOptionsText="No states found"
                    />
                  </FormControl>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => setNewStateDialog(true)}
                    disabled={fetchingLocations}
                    sx={addButtonStyle}
                  >
                    <AddIcon fontSize="medium" />
                  </Button>
                </Box>
              </Grid>

              <Grid item xs={12} md={6}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                  <FormControl fullWidth>
                    <Autocomplete
                      options={cities}
                      getOptionLabel={option => option.name}
                      value={selectedCity}
                      onChange={(_, newValue) => setSelectedCity(newValue)}
                      renderInput={params => (
                        <TextField
                          {...params}
                          label="City"
                          disabled={!selectedState || fetchingLocations}
                        />
                      )}
                      isOptionEqualToValue={(option, value) => option.id === value.id}
                      disabled={!selectedState || fetchingLocations}
                      loading={fetchingLocations}
                      loadingText="Loading cities..."
                      noOptionsText="No cities found"
                    />
                  </FormControl>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => setNewCityDialog(true)}
                    disabled={!selectedState || fetchingLocations}
                    sx={addButtonStyle}
                  >
                    <AddIcon fontSize="medium" />
                  </Button>
                </Box>
              </Grid>

              <Grid item xs={12} md={6}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                  <FormControl fullWidth error={!!errors.localityId}>
                    <Autocomplete
                      options={localities}
                      getOptionLabel={option => `${option.name} - ${option.pincode}`}
                      value={selectedLocality}
                      onChange={(_, newValue) => handleLocalityChange(newValue)}
                      renderInput={params => (
                        <TextField
                          {...params}
                          label="Locality"
                          disabled={!selectedCity || fetchingLocations}
                          error={!!errors.localityId}
                          helperText={errors.localityId}
                        />
                      )}
                      isOptionEqualToValue={(option, value) => option.id === value.id}
                      disabled={!selectedCity || fetchingLocations}
                      loading={fetchingLocations}
                      loadingText="Loading localities..."
                      noOptionsText="No localities found"
                    />
                    {errors.localityId && <FormHelperText>{errors.localityId}</FormHelperText>}
                  </FormControl>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => setNewLocalityDialog(true)}
                    disabled={!selectedCity || fetchingLocations}
                    sx={addButtonStyle}
                  >
                    <AddIcon fontSize="medium" />
                  </Button>
                </Box>
              </Grid>

              <Grid item xs={12} md={6}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <TimePicker
                    label="Opening Time"
                    value={
                      formData.openingTime ? new Date(`2023-01-01T${formData.openingTime}`) : null
                    }
                    onChange={newValue => handleTimeChange(newValue, 'openingTime')}
                    slotProps={{ textField: { fullWidth: true } }}
                  />
                </LocalizationProvider>
              </Grid>

              <Grid item xs={12} md={6}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <TimePicker
                    label="Closing Time"
                    value={
                      formData.closingTime ? new Date(`2023-01-01T${formData.closingTime}`) : null
                    }
                    onChange={newValue => handleTimeChange(newValue, 'closingTime')}
                    slotProps={{ textField: { fullWidth: true } }}
                  />
                </LocalizationProvider>
              </Grid>

              <Grid item xs={12}>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
                  <Button
                    component={Link}
                    to="/outlets"
                    variant="outlined"
                    color="secondary"
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={loading}
                    startIcon={loading && <CircularProgress size={20} color="inherit" />}
                  >
                    {loading ? 'Saving...' : isEditing ? 'Update Outlet' : 'Create Outlet'}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>

      {/* Dialog for creating a new state */}
      <Dialog
        open={newStateDialog}
        onClose={() => setNewStateDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Create New State</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="State Name"
            fullWidth
            value={newStateName}
            onChange={e => setNewStateName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setNewStateDialog(false)} color="inherit">
            Cancel
          </Button>
          <Button
            onClick={handleCreateState}
            color="primary"
            variant="contained"
            disabled={!newStateName.trim()}
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog for creating a new city */}
      <Dialog open={newCityDialog} onClose={() => setNewCityDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Create New City</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="City Name"
            fullWidth
            value={newCityName}
            onChange={e => setNewCityName(e.target.value)}
          />
          {selectedState && (
            <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
              This city will be added to {selectedState.name} state.
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setNewCityDialog(false)} color="inherit">
            Cancel
          </Button>
          <Button
            onClick={handleCreateCity}
            color="primary"
            variant="contained"
            disabled={!newCityName.trim() || !selectedState}
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog for creating a new locality */}
      <Dialog
        open={newLocalityDialog}
        onClose={() => setNewLocalityDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Create New Locality</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Locality Name"
            fullWidth
            value={newLocalityName}
            onChange={e => setNewLocalityName(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Pincode"
            fullWidth
            value={newLocalityPincode}
            onChange={e => setNewLocalityPincode(e.target.value)}
            sx={{ mt: 2 }}
            inputProps={{ maxLength: 6 }}
          />
          {selectedCity && (
            <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
              This locality will be added to {selectedCity.name} city.
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setNewLocalityDialog(false)} color="inherit">
            Cancel
          </Button>
          <Button
            onClick={handleCreateLocality}
            color="primary"
            variant="contained"
            disabled={!newLocalityName.trim() || !newLocalityPincode.trim() || !selectedCity}
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>

      {/* Google Maps Dialog */}
      <Dialog
        open={mapDialogOpen}
        onClose={handleCloseMapDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            height: '80vh',
            maxHeight: '700px',
          },
        }}
      >
        <DialogTitle>Select Location on Map</DialogTitle>
        <DialogContent>
          <Box
            ref={mapRef}
            sx={{
              width: '100%',
              height: 'calc(100% - 32px)',
              borderRadius: 1,
              overflow: 'hidden',
            }}
          />
          <Typography variant="caption" color="textSecondary" sx={{ mt: 1, display: 'block' }}>
            Click on the map to place a marker, or drag the existing marker to adjust the location.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseMapDialog} color="inherit">
            Cancel
          </Button>
          <Button onClick={handleCloseMapDialog} color="primary" variant="contained">
            Confirm Location
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default OutletForm;
