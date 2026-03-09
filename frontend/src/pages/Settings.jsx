// src/pages/Settings.jsx
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
  TextField,
  Button,
  useTheme,
  useMediaQuery,
  alpha,
  Alert,
  CircularProgress
} from '@mui/material';
import {
  Person,
  Email,
  Phone,
  Save,
} from '@mui/icons-material';
import React, { useEffect, useState } from 'react';
import api from '../services/api';

const Settings = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [profile, setProfile] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const token = localStorage.getItem('adminToken');

        if (!token) {
          setError('Please login again');
          setLoading(false);
          return;
        }

        const res = await api.get(
          '/auth/getUserDetailsForSetting',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (res.data.success) {
          setProfile(res.data.data);
        } else {
          setError(res.data.message);
        }
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || 'Server error');
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Loading profile...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ m: 2 }}>
        <Alert
          severity="error"
          action={
            <Button color="inherit" size="small" onClick={() => window.location.reload()}>
              Retry
            </Button>
          }
        >
          {error}
        </Alert>
      </Box>
    );
  }

  const styles = {
    pageTitle: {
      fontWeight: 700,
      mb: 0.5,
    },
    subtitle: {
      color: 'text.secondary',
      mb: 3,
    },
    card: {
      borderRadius: 3,
      border: `1px solid ${theme.palette.divider}`,
      background:
        theme.palette.mode === 'dark'
          ? alpha(theme.palette.background.paper, 0.6)
          : theme.palette.background.paper,
      boxShadow: theme.shadows[2],
      overflow: 'hidden',
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      gap: 2,
      p: isMobile ? 2 : 3,
      borderBottom: `1px solid ${theme.palette.divider}`,
      background:
        theme.palette.mode === 'dark'
          ? alpha(theme.palette.primary.main, 0.08)
          : alpha(theme.palette.primary.main, 0.04),
    },
    avatar: {
      width: isMobile ? 56 : 70,
      height: isMobile ? 56 : 70,
      bgcolor: theme.palette.primary.main,
      fontSize: isMobile ? 28 : 34,
      boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.4)}`,
    },
    profileName: {
      fontWeight: 700,
      fontSize: isMobile ? '1rem' : '1.25rem',
    },
    fieldIcon: {
      color: theme.palette.primary.main,
      mr: 1,
    },
    textField: {
      '& .MuiOutlinedInput-root': {
        borderRadius: 2,
      },
    },
    saveSection: {
      mt: 3,
      display: 'flex',
      justifyContent: isMobile ? 'center' : 'flex-end',
    },
    saveButton: {
      minWidth: isMobile ? '100%' : 200,
      borderRadius: 2,
      textTransform: 'none',
      fontWeight: 600,
      height: 44,
    },
  };

  return (
    <Box>
      <Typography variant="h4" sx={styles.pageTitle}>
        Admin Profile
      </Typography>

      <Typography variant="body1" sx={styles.subtitle}>
        Manage admin profile information
      </Typography>

      <Card sx={styles.card}>
        {/* Header */}
        <Box sx={styles.header}>
          <Avatar sx={styles.avatar}>
            <Person />
          </Avatar>

          <Box>
            <Typography sx={styles.profileName}>
              {profile?.name || 'N/A'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              System Administrator
            </Typography>
          </Box>
        </Box>

        {/* Content */}
        <CardContent sx={{ p: isMobile ? 2 : 3 }}>
          <Grid container spacing={2.5}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Full Name"
                value={profile.name || ''}
                disabled
                sx={styles.textField}
                InputProps={{
                  startAdornment: <Person sx={styles.fieldIcon} />,
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Phone Number"
                value={profile.phone || ''}
                disabled
                sx={styles.textField}
                InputProps={{
                  startAdornment: <Phone sx={styles.fieldIcon} />,
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email Address"
                value={profile.email || ''}
                disabled
                sx={styles.textField}
                InputProps={{
                  startAdornment: <Email sx={styles.fieldIcon} />,
                }}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Settings;