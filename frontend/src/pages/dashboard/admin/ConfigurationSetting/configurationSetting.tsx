import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  FormControl,
  Select,
  InputLabel,
  MenuItem,
  Backdrop,
  CircularProgress,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import apiClient from '@/services/interceptor'; // your axios instance
import CommonSnackbar from '@/components/customToast';

function PaymentSettings() {
  const [gatewayName, setGatewayName] = useState('');
  const [publicKey, setPublicKey] = useState('');
  const [secretKey, setSecretKey] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [isLoading, setIsLoading] = useState(false);
  const [settingId, setSettingId] = useState<string | null>(null); // for edit
  const [snackbar, setSnackbar] = React.useState({
    message: '',
    open: false,
    vertical: 'bottom',
    horizontal: 'center',
  });
  const handleCloseSnackbar = () => {
    setSnackbar((prevState) => ({
      ...prevState,
      open: false,
    }));
  };
  // ✅ Fetch existing payment setting
  const initializeData = async () => {
    setIsLoading(true);
    await fetchSetting();
    setIsLoading(false);
  };

  useEffect(() => {
    initializeData();
  }, []);
  const fetchSetting = async () => {
    try {
      const response = await apiClient.get('/api/payment/list-payment-settings/');
      const data = response.data?.data?.payment_settings[0];
      console.log('Payment settings:', data);

      if (data) {
        setSettingId(data?.id);
        setGatewayName(data?.gateway_name || '');
        setPublicKey(data?.public_api_key || '');
        setSecretKey(data?.secret_api_key || '');
        setCurrency(data?.default_currency || 'USD');
      }
    } catch (error) {
      console.error('Error fetching payment settings:', error);
    }
  }

  // ✅ Save or Update setting
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      gateway_name: gatewayName,
      public_api_key: publicKey,
      secret_api_key: secretKey,
      default_currency: currency,
    };

    try {
      if (settingId) {
        // Update existing
        const res = await apiClient.put(`/api/payment/update-payment-settings/${settingId}/`, payload);
        fetchSetting()
        console.log('Payment setting updated', res);
        setSnackbar((prevState) => ({
          ...prevState,
          open: true,
          message: res?.data?.data?.message,
        }));

      } else {
        // Create new
        const res = await apiClient.post('/api/payment/create-payment-settings/', payload);
        fetchSetting()
        console.log('Payment setting created');
        setSnackbar((prevState) => ({
          ...prevState,
          open: true,
          message: res?.data?.data?.message,
        }));
      }
      // alert('Payment Setting saved successfully!');
    } catch (error) {
      console.error('Error saving payment settings:', error);
      setSnackbar((prevState) => {
        let errorMessage = "An error occurred";

        if (error?.response?.data?.errors) {
          const errorData = error?.response?.data;

          if (errorData.status === "error" && errorData.errors) {
            // Extract specific field error messages
            const errorFields = Object.keys(errorData.errors);
            if (errorFields.length > 0) {
              const fieldErrors = errorFields.map(field => {
                return `${field}: ${errorData.errors[field].message}`;
              });
              errorMessage = fieldErrors.join(", ");
            }
          }
        }

        return {
          ...prevState,
          open: true,
          message: errorMessage,
          severity: "error"
        };
      });
    }
  };

  return (
    <Container maxWidth="lg" sx={{ padding: '20px', my: 5 }}>
      <CommonSnackbar
        message={snackbar.message}
        vertical={snackbar.vertical}
        horizontal={snackbar.horizontal}
        open={snackbar.open}
        onClose={handleCloseSnackbar} // Passing the function here
      />
      {isLoading && (
        <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={isLoading}>
          <CircularProgress color="inherit" />
        </Backdrop>
      )}
      <Typography variant="h4" gutterBottom>
        Payment Settings
      </Typography>

      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 3 }}>
        <FormControl fullWidth>
          <InputLabel id="gateway-label">Payment Gateway Name</InputLabel>
          <Select
            labelId="gateway-label"
            value={gatewayName}
            label="Payment Gateway Name"
            onChange={(e) => setGatewayName(e.target.value)}
          >
            <MenuItem value="Stripe">Stripe</MenuItem>
            <MenuItem value="Razorpay">Razorpay</MenuItem>
            <MenuItem value="PayPal">PayPal</MenuItem>
          </Select>
        </FormControl>

        <TextField
          label="Public API Key"
          variant="outlined"
          fullWidth
          placeholder="Enter your Public API Key"
          value={publicKey}
          onChange={(e) => setPublicKey(e.target.value)}
        />

        <TextField
          label="Secret API Key"
          variant="outlined"
          fullWidth
          type="password"
          placeholder="Enter your Secret API Key"
          value={secretKey}
          onChange={(e) => setSecretKey(e.target.value)}
        />

        <FormControl fullWidth>
          <InputLabel id="currency-label">Currency</InputLabel>
          <Select
            labelId="currency-label"
            value={currency}
            label="Currency"
            onChange={(e) => setCurrency(e.target.value)}
          >
            <MenuItem value="USD">USD</MenuItem>
            <MenuItem value="INR">INR</MenuItem>
            <MenuItem value="EUR">EUR</MenuItem>
          </Select>
        </FormControl>

        <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
          {settingId ? 'Update Payment Setting' : 'Save Payment Setting'}
        </Button>
      </Box>
    </Container>
  );
}

export default PaymentSettings;
