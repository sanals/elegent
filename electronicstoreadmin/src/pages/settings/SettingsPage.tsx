import { Save as SaveIcon } from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Container,
  Divider,
  Grid,
  TextField,
  Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { SettingsService } from '../../services/settings.service';
import { showNotification } from '../../utils/notification';

const SettingsPage: React.FC = () => {
  const [settings, setSettings] = useState({
    homepage: {
      featuredProductsCount: 0,
      latestProductsCount: 0,
    },
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  // Load settings from API on component mount
  useEffect(() => {
    const fetchSettings = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await SettingsService.getHomepageSettings();
        if (response.status === 'SUCCESS' && response.data) {
          setSettings({
            homepage: {
              featuredProductsCount: response.data.featuredProductsCount,
              latestProductsCount: response.data.latestProductsCount,
            },
          });
        } else {
          setError(`Could not load settings: ${response.message || 'Unknown error'}`);
        }
      } catch (error) {
        console.error('Error loading settings:', error);
        setError('Could not load settings from server. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleSettingChange = (section: 'homepage', field: string, value: number) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
    setSaved(false);
  };

  const saveSettings = async () => {
    setIsSaving(true);
    setError(null);

    try {
      const response = await SettingsService.saveHomepageSettings({
        featuredProductsCount: settings.homepage.featuredProductsCount,
        latestProductsCount: settings.homepage.latestProductsCount,
      });

      if (response.status === 'SUCCESS') {
        showNotification('Settings saved successfully', 'success');
        setSaved(true);
      } else {
        showNotification(`Error saving settings: ${response.message}`, 'error');
        setError(`Failed to save settings: ${response.message}`);
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      showNotification('Error saving settings', 'error');
      setError('Failed to save settings. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Container>
      <Box sx={{ mt: 3, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Settings
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {saved && (
          <Alert severity="success" sx={{ mb: 3 }}>
            Settings have been saved successfully
          </Alert>
        )}

        <Card sx={{ mb: 4 }}>
          <CardHeader title="Homepage Settings" />
          <Divider />
          <CardContent>
            {isLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
                <CircularProgress />
              </Box>
            ) : (
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Featured Products Count"
                    type="number"
                    value={settings.homepage.featuredProductsCount}
                    onChange={e =>
                      handleSettingChange(
                        'homepage',
                        'featuredProductsCount',
                        parseInt(e.target.value) || 0
                      )
                    }
                    helperText="Number of products to display in the homepage carousel"
                    InputProps={{ inputProps: { min: 1, max: 10 } }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Latest Products Count"
                    type="number"
                    value={settings.homepage.latestProductsCount}
                    onChange={e =>
                      handleSettingChange(
                        'homepage',
                        'latestProductsCount',
                        parseInt(e.target.value) || 0
                      )
                    }
                    helperText="Number of products to display in the Latest Products section"
                    InputProps={{ inputProps: { min: 4, max: 24 } }}
                  />
                </Grid>
              </Grid>
            )}
          </CardContent>
        </Card>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<SaveIcon />}
            onClick={saveSettings}
            disabled={isSaving || isLoading}
          >
            {isSaving ? 'Saving...' : 'Save Settings'}
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default SettingsPage;
