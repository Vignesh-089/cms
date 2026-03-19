import React from 'react';
import {
    Paper,
    Typography,
    Grid,
    TextField,
    Button,
    Box,
    InputAdornment,
    useTheme,
    alpha,
    CircularProgress,
    Divider,
    Avatar,
    Chip,
} from '@mui/material';
import {
    Person,
    Work,
    LocationOn,
    Notes,
    ArrowBack,
    Save,
    Business,
    Email,
    Phone,
    Home,
    Flag,
    PinDrop,
    Assignment,
} from '@mui/icons-material';

const ClientDetailsStep = ({
    formData,
    onChange,
    onBack,
    onReset,
    onSave,
    saving
}) => {
    const theme = useTheme();
    const isDarkMode = theme.palette.mode === 'dark';

    const styles = {
        paper: {
            p: { xs: 2, sm: 3, md: 4 },
            borderRadius: { xs: 3, sm: 4 },
            bgcolor: isDarkMode 
                ? alpha(theme.palette.background.paper, 0.8)
                : 'background.paper',
            backdropFilter: 'blur(10px)',
            border: '1px solid',
            borderColor: alpha(theme.palette.divider, 0.1),
            position: 'relative',
            overflow: 'hidden',
        },
        input: {
            borderRadius: 2.5,
            bgcolor: isDarkMode 
                ? alpha(theme.palette.common.white, 0.03)
                : alpha(theme.palette.common.black, 0.02),
            '& .MuiOutlinedInput-notchedOutline': {
                borderColor: alpha(theme.palette.divider, 0.2),
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: theme.palette.primary.main,
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderWidth: 2,
            },
            height: { xs: 48, sm: 52 },
        },
        multilineInput: {
            borderRadius: 2.5,
            bgcolor: isDarkMode 
                ? alpha(theme.palette.common.white, 0.03)
                : alpha(theme.palette.common.black, 0.02),
            '& .MuiOutlinedInput-notchedOutline': {
                borderColor: alpha(theme.palette.divider, 0.2),
            },
        },
        button: {
            borderRadius: 3,
            textTransform: 'none',
            px: { xs: 2, sm: 4 },
            py: 1.2,
            fontWeight: 600,
            fontSize: { xs: '0.85rem', sm: '0.95rem' },
            boxShadow: 'none',
            '&:hover': {
                boxShadow: theme.shadows[4],
            },
        },
        sectionTitle: {
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            mb: 2.5,
            color: 'text.primary',
            fontWeight: 600,
            fontSize: { xs: '1rem', sm: '1.15rem' },
        },
    };

    // Decorative background elements
    const DecorativeElements = () => (
        <>
            <Box sx={{
                position: 'absolute',
                top: -20,
                right: -20,
                width: { xs: 150, sm: 200 },
                height: { xs: 150, sm: 200 },
                borderRadius: '50%',
                background: `radial-gradient(circle, ${alpha(theme.palette.warning.light, 0.1)} 0%, transparent 70%)`,
                zIndex: 0,
            }} />
            <Box sx={{
                position: 'absolute',
                bottom: -30,
                left: -30,
                width: { xs: 200, sm: 250 },
                height: { xs: 200, sm: 250 },
                borderRadius: '50%',
                background: `radial-gradient(circle, ${alpha(theme.palette.primary.light, 0.08)} 0%, transparent 70%)`,
                zIndex: 0,
            }} />
        </>
    );

    return (
        <Paper sx={styles.paper} elevation={3}>
            <DecorativeElements />
            
            {/* Header Section */}
            <Box sx={{ position: 'relative', zIndex: 1, mb: 3 }}>
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: 2,
                    mb: 2,
                }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar sx={{
                            bgcolor: alpha(theme.palette.warning.main, 0.1),
                            color: theme.palette.warning.main,
                            width: { xs: 44, sm: 52 },
                            height: { xs: 44, sm: 52 },
                        }}>
                            <Person sx={{ fontSize: { xs: 24, sm: 28 } }} />
                        </Avatar>
                        <Box>
                            <Typography 
                                variant="h6" 
                                fontWeight={700}
                                sx={{
                                    fontSize: { xs: '1.1rem', sm: '1.3rem' },
                                    lineHeight: 1.2,
                                }}
                            >
                                Client Information
                            </Typography>
                            <Typography 
                                variant="body2" 
                                sx={{
                                    color: 'text.secondary',
                                    fontSize: { xs: '0.75rem', sm: '0.85rem' },
                                }}
                            >
                                Add optional details to save this record
                            </Typography>
                        </Box>
                    </Box>
                    
                    <Chip
                        icon={<Assignment />}
                        label="Optional Step"
                        size="small"
                        sx={{
                            bgcolor: alpha(theme.palette.info.main, 0.1),
                            color: theme.palette.info.main,
                            fontWeight: 600,
                            height: { xs: 28, sm: 32 },
                        }}
                    />
                </Box>
                <Divider sx={{ opacity: 0.6 }} />
            </Box>

            {/* Form Fields - All fields now have consistent height */}
            <Box sx={{ position: 'relative', zIndex: 1 }}>
                <Grid container spacing={2.5}>
                    {/* Personal Information Section */}
                    <Grid item xs={12}>
                        <Typography sx={styles.sectionTitle}>
                            <Box sx={{
                                p: 0.5,
                                borderRadius: 1.5,
                                bgcolor: alpha(theme.palette.primary.main, 0.1),
                                display: 'flex',
                            }}>
                                <Person fontSize="small" sx={{ color: theme.palette.primary.main }} />
                            </Box>
                            Personal Details
                        </Typography>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Full Name"
                            name="clientName"
                            value={formData.clientName}
                            onChange={onChange}
                            size="small"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Person sx={{ color: theme.palette.primary.main, fontSize: 20 }} />
                                    </InputAdornment>
                                ),
                                sx: styles.input,
                            }}
                            placeholder="e.g., John Doe"
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Occupation"
                            name="occupation"
                            value={formData.occupation}
                            onChange={onChange}
                            size="small"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Work sx={{ color: theme.palette.primary.main, fontSize: 20 }} />
                                    </InputAdornment>
                                ),
                                sx: styles.input,
                            }}
                            placeholder="e.g., Software Engineer"
                        />
                    </Grid>

                    {/* Contact Information Section */}
                    <Grid item xs={12}>
                        <Typography sx={styles.sectionTitle}>
                            <Box sx={{
                                p: 0.5,
                                borderRadius: 1.5,
                                bgcolor: alpha(theme.palette.success.main, 0.1),
                                display: 'flex',
                            }}>
                                <Business fontSize="small" sx={{ color: theme.palette.success.main }} />
                            </Box>
                            Contact Information
                        </Typography>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Email"
                            name="email"
                            value={formData.email}
                            onChange={onChange}
                            size="small"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Email sx={{ color: theme.palette.success.main, fontSize: 20 }} />
                                    </InputAdornment>
                                ),
                                sx: styles.input,
                            }}
                            placeholder="email@example.com"
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Phone"
                            name="phone"
                            value={formData.phone}
                            onChange={onChange}
                            size="small"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Phone sx={{ color: theme.palette.success.main, fontSize: 20 }} />
                                    </InputAdornment>
                                ),
                                sx: styles.input,
                            }}
                            placeholder="+1 234 567 8900"
                        />
                    </Grid>

                    {/* Address Section */}
                    <Grid item xs={12}>
                        <Typography sx={styles.sectionTitle}>
                            <Box sx={{
                                p: 0.5,
                                borderRadius: 1.5,
                                bgcolor: alpha(theme.palette.warning.main, 0.1),
                                display: 'flex',
                            }}>
                                <LocationOn fontSize="small" sx={{ color: theme.palette.warning.main }} />
                            </Box>
                            Address Details
                        </Typography>
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Street Address"
                            name="address"
                            value={formData.address}
                            onChange={onChange}
                            size="small"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Home sx={{ color: theme.palette.warning.main, fontSize: 20 }} />
                                    </InputAdornment>
                                ),
                                sx: styles.input,
                            }}
                            placeholder="123 Main Street"
                        />
                    </Grid>

                    <Grid item xs={12} sm={4}>
                        <TextField
                            fullWidth
                            label="City"
                            name="city"
                            value={formData.city}
                            onChange={onChange}
                            size="small"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Flag sx={{ color: theme.palette.warning.main, fontSize: 20 }} />
                                    </InputAdornment>
                                ),
                                sx: styles.input,
                            }}
                            placeholder="New York"
                        />
                    </Grid>

                    <Grid item xs={12} sm={4}>
                        <TextField
                            fullWidth
                            label="State"
                            name="state"
                            value={formData.state}
                            onChange={onChange}
                            size="small"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <LocationOn sx={{ color: theme.palette.warning.main, fontSize: 20 }} />
                                    </InputAdornment>
                                ),
                                sx: styles.input,
                            }}
                            placeholder="NY"
                        />
                    </Grid>

                    <Grid item xs={12} sm={4}>
                        <TextField
                            fullWidth
                            label="Pincode"
                            name="pincode"
                            value={formData.pincode}
                            onChange={onChange}
                            size="small"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <PinDrop sx={{ color: theme.palette.warning.main, fontSize: 20 }} />
                                    </InputAdornment>
                                ),
                                sx: styles.input,
                            }}
                            placeholder="10001"
                        />
                    </Grid>

                    {/* Additional Notes */}
                    <Grid item xs={12}>
                        <Typography sx={styles.sectionTitle}>
                            <Box sx={{
                                p: 0.5,
                                borderRadius: 1.5,
                                bgcolor: alpha(theme.palette.info.main, 0.1),
                                display: 'flex',
                            }}>
                                <Notes fontSize="small" sx={{ color: theme.palette.info.main }} />
                            </Box>
                            Additional Notes
                        </Typography>
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Notes"
                            name="notes"
                            value={formData.notes}
                            onChange={onChange}
                            multiline
                            rows={3}
                            size="small"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Notes sx={{ color: theme.palette.info.main, fontSize: 20 }} />
                                    </InputAdornment>
                                ),
                                sx: styles.multilineInput,
                            }}
                            placeholder="Any additional information about the client..."
                        />
                    </Grid>
                </Grid>
            </Box>

            {/* Action Buttons */}
            <Box sx={{ 
                position: 'relative',
                zIndex: 1,
                display: 'flex', 
                justifyContent: 'space-between', 
                mt: 4,
                flexDirection: { xs: 'column', sm: 'row' },
                gap: { xs: 2, sm: 0 },
            }}>
                <Button
                    variant="outlined"
                    onClick={onBack}
                    startIcon={<ArrowBack />}
                    sx={{
                        ...styles.button,
                        width: { xs: '100%', sm: 'auto' },
                        borderWidth: 2,
                        '&:hover': { borderWidth: 2 },
                    }}
                >
                    Back to Results
                </Button>
                
                <Box sx={{ 
                    display: 'flex', 
                    gap: 2,
                    flexDirection: { xs: 'column', sm: 'row' },
                    width: { xs: '100%', sm: 'auto' },
                }}>
                    <Button
                        variant="outlined"
                        onClick={onReset}
                        sx={{
                            ...styles.button,
                            width: { xs: '100%', sm: 'auto' },
                            borderColor: alpha(theme.palette.error.main, 0.5),
                            color: theme.palette.error.main,
                            '&:hover': {
                                borderColor: theme.palette.error.main,
                                bgcolor: alpha(theme.palette.error.main, 0.05),
                            },
                        }}
                    >
                        Skip & New
                    </Button>
                    <Button
                        variant="contained"
                        onClick={onSave}
                        disabled={saving}
                        startIcon={saving ? <CircularProgress size={20} /> : <Save />}
                        sx={{
                            ...styles.button,
                            width: { xs: '100%', sm: 'auto' },
                            background: `linear-gradient(135deg, ${theme.palette.success.main} 0%, ${theme.palette.success.dark} 100%)`,
                            '&:hover': {
                                background: `linear-gradient(135deg, ${theme.palette.success.dark} 0%, ${theme.palette.success.main} 100%)`,
                            },
                        }}
                    >
                        {saving ? 'Saving...' : 'Save Client'}
                    </Button>
                </Box>
            </Box>

            {/* Progress indicator */}
            <Box sx={{
                position: 'relative',
                zIndex: 1,
                mt: 3,
                display: 'flex',
                alignItems: 'center',
                gap: 1,
            }}>
                <Box sx={{
                    flex: 1,
                    height: 4,
                    bgcolor: alpha(theme.palette.divider, 0.2),
                    borderRadius: 2,
                    overflow: 'hidden',
                }}>
                    <Box sx={{
                        width: '60%',
                        height: '100%',
                        background: `linear-gradient(90deg, ${theme.palette.warning.main}, ${theme.palette.primary.main})`,
                        borderRadius: 2,
                    }} />
                </Box>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    Optional - 60% complete
                </Typography>
            </Box>
        </Paper>
    );
};

export default ClientDetailsStep;