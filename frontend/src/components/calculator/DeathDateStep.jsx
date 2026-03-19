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
    Fade,
} from '@mui/material';
import {
    CalendarToday,
    Phone,
    Calculate,
    Info,
    Event,
    CheckCircle,
    ArrowForward,
} from '@mui/icons-material';

const DeathDateStep = ({
    formData,
    errors,
    touched,
    onchange,
    onBlur,
    onCalculate,
    calculating
}) => {
    const theme = useTheme();
    const isDarkMode = theme.palette.mode === 'dark';

    // Enhanced styles with more visual appeal
    const styles = {
        paper: {
            p: { xs: 2.5, sm: 3, md: 4 },
            borderRadius: { xs: 3, sm: 4 },
            bgcolor: isDarkMode 
                ? alpha(theme.palette.background.paper, 0.7)
                : 'background.paper',
            backdropFilter: 'blur(20px)',
            border: '1px solid',
            borderColor: alpha(theme.palette.divider, 0.1),
            position: 'relative',
            overflow: 'hidden',
            boxShadow: isDarkMode 
                ? '0 8px 32px rgba(0,0,0,0.4)'
                : '0 8px 32px rgba(0,0,0,0.08)',
        },
        input: {
            borderRadius: 3,
            height: { xs: 50, sm: 56 },
            bgcolor: isDarkMode 
                ? alpha(theme.palette.common.white, 0.03)
                : alpha(theme.palette.common.black, 0.02),
            '& .MuiOutlinedInput-notchedOutline': {
                borderColor: alpha(theme.palette.divider, 0.2),
                borderWidth: 2,
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: theme.palette.primary.main,
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: theme.palette.primary.main,
                borderWidth: 2,
            },
            transition: 'all 0.2s ease',
        },
        button: {
            borderRadius: 3,
            textTransform: 'none',
            px: { xs: 3, sm: 4 },
            py: 1.2,
            height: { xs: 48, sm: 52 },
            fontWeight: 600,
            fontSize: { xs: '0.9rem', sm: '1rem' },
            minWidth: { xs: '100%', sm: 220 },
            boxShadow: 'none',
            '&:hover': {
                boxShadow: `0 8px 16px ${alpha(theme.palette.primary.main, 0.3)}`,
            },
        },
        decorativeCircle: {
            position: 'absolute',
            width: { xs: 200, sm: 300 },
            height: { xs: 200, sm: 300 },
            borderRadius: '50%',
            background: `radial-gradient(circle, ${alpha(theme.palette.primary.light, 0.1)} 0%, transparent 70%)`,
            zIndex: 0,
        },
    };

    // Decorative background elements
    const DecorativeElements = () => (
        <>
            <Box sx={{
                ...styles.decorativeCircle,
                top: -100,
                right: -100,
            }} />
            <Box sx={{
                ...styles.decorativeCircle,
                bottom: -150,
                left: -100,
                background: `radial-gradient(circle, ${alpha(theme.palette.info.light, 0.08)} 0%, transparent 70%)`,
            }} />
        </>
    );

    return (
        <Paper sx={styles.paper} elevation={0}>
            <DecorativeElements />
            
            <Box sx={{ position: 'relative', zIndex: 1 }}>
                {/* Header Section with Visual Interest */}
                <Box sx={{ mb: 3.5 }}>
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
                                bgcolor: alpha(theme.palette.info.main, 0.1),
                                color: theme.palette.info.main,
                                width: { xs: 48, sm: 56 },
                                height: { xs: 48, sm: 56 },
                            }}>
                                <Event sx={{ fontSize: { xs: 24, sm: 28 } }} />
                            </Avatar>
                            <Box>
                                <Typography 
                                    variant="h6" 
                                    fontWeight={700}
                                    sx={{
                                        fontSize: { xs: '1.2rem', sm: '1.4rem' },
                                        lineHeight: 1.2,
                                        background: `linear-gradient(135deg, ${theme.palette.info.main}, ${theme.palette.primary.main})`,
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                    }}
                                >
                                    Death Anniversary Calculator
                                </Typography>
                                <Typography 
                                    variant="body2" 
                                    sx={{
                                        color: 'text.secondary',
                                        fontSize: { xs: '0.8rem', sm: '0.9rem' },
                                        mt: 0.5,
                                    }}
                                >
                                    Calculate Panchang-based anniversary dates with precision
                                </Typography>
                            </Box>
                        </Box>
                        
                        <Chip
                            icon={<Info />}
                            label="Required Information"
                            size="small"
                            sx={{
                                bgcolor: alpha(theme.palette.info.main, 0.1),
                                color: theme.palette.info.main,
                                fontWeight: 600,
                                height: { xs: 28, sm: 32 },
                                '& .MuiChip-icon': { fontSize: { xs: 16, sm: 18 } },
                            }}
                        />
                    </Box>
                    <Divider sx={{ 
                        opacity: 0.6,
                        '&::before, &::after': {
                            borderColor: alpha(theme.palette.divider, 0.3),
                        }
                    }}>
                        <Chip 
                            label="STEP 1 OF 3" 
                            size="small"
                            sx={{ 
                                fontSize: '0.7rem',
                                fontWeight: 600,
                                bgcolor: alpha(theme.palette.info.main, 0.05),
                            }}
                        />
                    </Divider>
                </Box>

                {/* Form Fields */}
                <Grid container spacing={3}>
                    {/* Death Date Field - Enhanced */}
                    <Grid item xs={12} md={7}>
                        <Box sx={{ mb: { xs: 0, md: 0 } }}>
                            <Typography 
                                variant="subtitle2" 
                                sx={{ 
                                    mb: 1,
                                    fontWeight: 600,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 0.5,
                                }}
                            >
                                <CalendarToday sx={{ fontSize: 16, color: theme.palette.primary.main }} />
                                Date of Death <span style={{ color: theme.palette.error.main }}>*</span>
                            </Typography>
                            <TextField
                                fullWidth
                                required
                                name="deathDate"
                                type="date"
                                value={formData.deathDate}
                                onChange={onchange}
                                onBlur={onBlur}
                                error={touched.deathDate && !!errors.deathDate}
                                helperText={touched.deathDate && errors.deathDate}
                                InputLabelProps={{ shrink: true }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Box sx={{
                                                p: 0.5,
                                                borderRadius: 1.5,
                                                bgcolor: alpha(theme.palette.primary.main, 0.1),
                                                display: 'flex',
                                            }}>
                                                <CalendarToday sx={{ 
                                                    color: theme.palette.primary.main,
                                                    fontSize: { xs: 18, sm: 20 },
                                                }} />
                                            </Box>
                                        </InputAdornment>
                                    ),
                                    endAdornment: formData.deathDate && !errors.deathDate && (
                                        <InputAdornment position="end">
                                            <Fade in={true}>
                                                <CheckCircle sx={{ 
                                                    color: theme.palette.success.main,
                                                    fontSize: 20,
                                                }} />
                                            </Fade>
                                        </InputAdornment>
                                    ),
                                    sx: styles.input,
                                }}
                                size="small"
                                placeholder="YYYY-MM-DD"
                            />
                        </Box>
                    </Grid>

                    {/* Phone Number Field - Enhanced */}
                    <Grid item xs={12} md={5}>
                        <Box>
                            <Typography 
                                variant="subtitle2" 
                                sx={{ 
                                    mb: 1,
                                    fontWeight: 600,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 0.5,
                                }}
                            >
                                <Phone sx={{ fontSize: 16, color: theme.palette.success.main }} />
                                Phone Number <span style={{ color: theme.palette.text.disabled }}>(Optional)</span>
                            </Typography>
                            <TextField
                                fullWidth
                                name="phoneNumber"
                                value={formData.phoneNumber}
                                onChange={onchange}
                                onBlur={onBlur}
                                error={touched.phoneNumber && !!errors.phoneNumber}
                                helperText={touched.phoneNumber && errors.phoneNumber}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Box sx={{
                                                p: 0.5,
                                                borderRadius: 1.5,
                                                bgcolor: alpha(theme.palette.success.main, 0.1),
                                                display: 'flex',
                                            }}>
                                                <Phone sx={{ 
                                                    color: theme.palette.success.main,
                                                    fontSize: { xs: 18, sm: 20 },
                                                }} />
                                            </Box>
                                        </InputAdornment>
                                    ),
                                    sx: styles.input,
                                }}
                                size="small"
                                placeholder="+1 234 567 8900"
                            />
                        </Box>
                    </Grid>

                    {/* Action Button */}
                    <Grid item xs={12}>
                        <Box sx={{ 
                            display: 'flex', 
                            justifyContent: { xs: 'center', sm: 'flex-end' },
                            mt: 1,
                        }}>
                            <Button
                                variant="contained"
                                onClick={onCalculate}
                                disabled={calculating || !formData.deathDate}
                                startIcon={calculating ? <CircularProgress size={20} /> : <Calculate />}
                                endIcon={!calculating && <ArrowForward />}
                                sx={{
                                    ...styles.button,
                                    background: `linear-gradient(135deg, ${theme.palette.info.main} 0%, ${theme.palette.primary.main} 100%)`,
                                    opacity: (!formData.deathDate || calculating) ? 0.7 : 1,
                                    width: { xs: '100%', sm: 'auto' },
                                }}
                            >
                                {calculating ? 'Calculating Panchang Details...' : 'Calculate Anniversary'}
                            </Button>
                        </Box>
                    </Grid>
                </Grid>

                {/* Quick Info Footer */}
                <Box sx={{
                    mt: 3,
                    pt: 2,
                    borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: 2,
                }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box sx={{
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            bgcolor: theme.palette.success.main,
                        }} />
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                            Panchang calculations based on traditional methods
                        </Typography>
                    </Box>
                    <Typography variant="caption" sx={{ 
                        color: 'text.disabled',
                        fontStyle: 'italic',
                    }}>
                        Fields marked with * are required
                    </Typography>
                </Box>
            </Box>
        </Paper>
    );
};

export default DeathDateStep;