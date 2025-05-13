import React, { useEffect, useState } from 'react';
import {
  Container, Typography, FormGroup, FormControlLabel,
  Switch, Button, Box, CircularProgress
} from '@mui/material';
import axios from 'axios';
import apiClient from '../../../../services/interceptor';

function NotificationSettings() {
  const [settings, setSettings] = useState({
    email_enabled: false,
    sms_enabled: false,
    push_enabled: false,
    admin_only: true
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchSettings = async () => {
    try {
      const res = await apiClient.get('/api/notification/settings', {
        headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
      });
      setSettings(res.data.data.settings);
    } catch (err) {
      console.error('Failed to fetch settings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field) => (event) => {
    setSettings(prev => ({ ...prev, [field]: event.target.checked }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await apiClient.put('/api/notification/settings', settings, {
        headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
      });
      alert("Settings updated successfully!");
    } catch (err) {
      console.error('Failed to update settings:', err);
      alert("Failed to update settings.");
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  if (loading) return (
    <Container maxWidth="sm" sx={{ mt: 5, textAlign: 'center' }}>
      <CircularProgress />
    </Container>
  );

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <Typography variant="h4" gutterBottom>Notification Settings</Typography>
      <Box sx={{ mt: 3 }}>
        <FormGroup>
          <FormControlLabel
            control={
              <Switch
                checked={settings.email_enabled}
                onChange={handleChange('email_enabled')}
              />
            }
            label="Email Notifications"
          />
          <FormControlLabel
            control={
              <Switch
                checked={settings.sms_enabled}
                onChange={handleChange('sms_enabled')}
              />
            }
            label="SMS Notifications"
          />
          <FormControlLabel
            control={
              <Switch
                checked={settings.push_enabled}
                onChange={handleChange('push_enabled')}
              />
            }
            label="Push Notifications"
          />
          <FormControlLabel
            control={
              <Switch
                checked={settings.admin_only}
                onChange={handleChange('admin_only')}
              />
            }
            label="Admin Only"
          />
        </FormGroup>

        <Button
          variant="contained"
          color="primary"
          onClick={handleSave}
          sx={{ mt: 3 }}
          disabled={saving}
        >
          {saving ? 'Saving...' : 'Save Settings'}
        </Button>
      </Box>
    </Container>
  );
}

export default NotificationSettings;
