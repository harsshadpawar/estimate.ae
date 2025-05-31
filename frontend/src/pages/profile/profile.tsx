import React from 'react';
import { useSelector } from 'react-redux';
import { Box, Typography, Grid, Button, Avatar } from '@mui/material';
import CardBox from '@/components/card';

export type UserProfile = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  title: string;
  company_name: string;
  avatar?: string;
};

function Profile() {
  const user: UserProfile = useSelector((state: any) => state.auth.userProfileData);

  const formatValue = (value: string | undefined) => {
    return value && value.trim() !== '' ? value : '--';
  };

  return (
    <Box sx={{ padding: 3, backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <Grid container spacing={3}>
        {/* Left Column */}
        <Grid item xs={12} md={6}>
          {/* Active Plan Card */}
          <CardBox title="Active Plan">
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Active plan
                </Typography>
                <Typography variant="body2" fontWeight="bold">
                  Free
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="body2" color="text.secondary">
                  Plan ends on
                </Typography>
                <Typography variant="body2">
                  11/23/2024 01:43:47 PM IST
                </Typography>
              </Box>

              <Box 
                sx={{ 
                  backgroundColor: '#e8e8e8', 
                  padding: 2, 
                  borderRadius: 1, 
                  textAlign: 'center',
                  mb: 3
                }}
              >
                <Typography variant="body2" fontWeight="bold">
                  REMAINING CALCULATIONS 200
                </Typography>
              </Box>

              <Button 
                variant="contained" 
                sx={{ 
                  backgroundColor: '#2196f3',
                  textTransform: 'none',
                  borderRadius: 2,
                  px: 3
                }}
                startIcon={<span>+</span>}
              >
                Upgrade Calculation Packages
              </Button>
            </Box>
          </CardBox>

          {/* Support and Resources Card */}
          <Box sx={{ mt: 3 }}>
            <CardBox title="Support and Resources">
              <Grid container spacing={3}>
                <Grid item xs={12} sm={4}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Box sx={{ 
                      width: 40, 
                      height: 40, 
                      borderRadius: '50%', 
                      backgroundColor: '#2196f3',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 8px',
                      color: 'white'
                    }}>
                      ?
                    </Box>
                    <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1 }}>
                      FAQs
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2, fontSize: '0.875rem' }}>
                      Need help configuring your settings? Check out our FAQ section 
                      for step-by-step guidance to meet your needs.
                    </Typography>
                    <Button 
                      variant="text" 
                      sx={{ color: '#2196f3', textTransform: 'none' }}
                    >
                      View FAQs
                    </Button>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={4}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Box sx={{ 
                      width: 40, 
                      height: 40, 
                      borderRadius: '50%', 
                      backgroundColor: '#ff9800',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 8px',
                      color: 'white'
                    }}>
                      ☎
                    </Box>
                    <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1 }}>
                      Support
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2, fontSize: '0.875rem' }}>
                      Need direct assistance? Contact our support team by phone, 
                      email, or chat. We're here to answer your questions.
                    </Typography>
                    <Button 
                      variant="text" 
                      sx={{ color: '#2196f3', textTransform: 'none' }}
                    >
                      View Support
                    </Button>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={4}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Box sx={{ 
                      width: 40, 
                      height: 40, 
                      borderRadius: '50%', 
                      backgroundColor: '#4caf50',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 8px',
                      color: 'white'
                    }}>
                      ?
                    </Box>
                    <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1 }}>
                      Help
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2, fontSize: '0.875rem' }}>
                      Need help? Our Customer Support team is here to assist you with 
                      any questions or issues.
                    </Typography>
                    <Button 
                      variant="text" 
                      sx={{ color: '#2196f3', textTransform: 'none' }}
                    >
                      Help Center
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </CardBox>
          </Box>

          {/* Delete Account Card */}
          <Box sx={{ mt: 3 }}>
            <Box 
              sx={{ 
                backgroundColor: '#ffebee',
                border: '1px solid #ffcdd2',
                borderRadius: 2,
                padding: 2
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Box sx={{ color: '#f44336', mr: 1, fontSize: '18px' }}>🗑</Box>
                <Typography variant="subtitle2" fontWeight="bold" color="#f44336">
                  Delete Account
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                If you delete your account now, you will have the option to recover it within 30 days.
              </Typography>
            </Box>
          </Box>
        </Grid>

        {/* Right Column */}
        <Grid item xs={12} md={6}>
          {/* User Profile Card */}
          <CardBox title="User Profile">
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Avatar
                src={user?.avatar}
                sx={{ 
                  width: 80, 
                  height: 80, 
                  mr: 3,
                  backgroundColor: '#2196f3',
                  fontSize: '2rem'
                }}
              >
                {user?.first_name?.charAt(0) || user?.last_name?.charAt(0) || 'U'}
              </Avatar>
              <Box>
                <Typography variant="h6" fontWeight="bold">
                  {formatValue(`${user?.first_name || ''} ${user?.last_name || ''}`.trim())}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {formatValue(user?.email)}
                </Typography>
              </Box>
            </Box>

            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                  First Name
                </Typography>
                <Typography variant="body2" fontWeight="medium">
                  {formatValue(user?.first_name)}
                </Typography>
              </Grid>
              
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                  Last Name
                </Typography>
                <Typography variant="body2" fontWeight="medium">
                  {formatValue(user?.last_name)}
                </Typography>
              </Grid>

              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                  Role
                </Typography>
                <Typography variant="body2" fontWeight="medium">
                  {formatValue(user?.role)}
                </Typography>
              </Grid>

              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                  Title
                </Typography>
                <Typography variant="body2" fontWeight="medium">
                  {formatValue(user?.title)}
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                  Company
                </Typography>
                <Typography variant="body2" fontWeight="medium">
                  {formatValue(user?.company_name)}
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                  User ID
                </Typography>
                <Typography variant="body2" fontWeight="medium">
                  {formatValue(user?.id)}
                </Typography>
              </Grid>
            </Grid>

            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
              <Button 
                variant="contained"
                sx={{ 
                  backgroundColor: '#2196f3',
                  textTransform: 'none',
                  borderRadius: 2,
                  px: 3
                }}
              >
                Edit Profile →
              </Button>
            </Box>
          </CardBox>

          {/* Billing Address Management Card */}
          <Box sx={{ mt: 3 }}>
            <CardBox title="Billing Address Management">
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                <Box sx={{ color: '#2196f3', fontSize: '16px' }}>✓</Box>
              </Box>

              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                    Company
                  </Typography>
                  <Typography variant="body2" fontWeight="medium">
                    Ratke, Simonis and Kertzmann
                  </Typography>
                </Grid>

                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                    Street Address
                  </Typography>
                  <Typography variant="body2" fontWeight="medium">
                    2109 N 4th St
                  </Typography>
                </Grid>

                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                    Zip Code
                  </Typography>
                  <Typography variant="body2" fontWeight="medium">
                    86004
                  </Typography>
                </Grid>

                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                    City
                  </Typography>
                  <Typography variant="body2" fontWeight="medium">
                    Flagstaff
                  </Typography>
                </Grid>

                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                    Country
                  </Typography>
                  <Typography variant="body2" fontWeight="medium">
                    USA
                  </Typography>
                </Grid>

                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                    Invoice email address
                  </Typography>
                  <Typography variant="body2" fontWeight="medium">
                    info@raak.com
                  </Typography>
                </Grid>
              </Grid>

              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                <Button 
                  variant="contained"
                  sx={{ 
                    backgroundColor: '#2196f3',
                    textTransform: 'none',
                    borderRadius: 2,
                    px: 3
                  }}
                >
                  Show Invoices →
                </Button>
              </Box>
            </CardBox>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Profile;