import React from 'react';
import { Card, CardContent, Typography, Chip, alpha, useTheme, Box } from '@mui/material';
import { Celebration, AccessTime, Star, CalendarToday } from '@mui/icons-material';
import { safeFormat, getDaysUntilAnniversary } from '../../utils/dateHelpers';

const AnniversaryStatCard = ({ 
    title, 
    date, 
    value, 
    color = 'primary',
    icon,
    showChip = false,
    variant = 'default' // 'default', 'compact', or 'detailed'
}) => {
    const theme = useTheme();
    const isDarkMode = theme.palette.mode === 'dark';
    const status = showChip ? getDaysUntilAnniversary(date) : null;

    const getIcon = () => {
        if (icon) return icon;
        if (title.includes('Anniversary')) return <Star fontSize="small" sx={{ color: theme.palette.warning.main }} />;
        return <CalendarToday fontSize="small" sx={{ color: theme.palette.info.main }} />;
    };

    const getGradientBackground = () => {
        if (isDarkMode) {
            return `linear-gradient(135deg, ${alpha(theme.palette[color].dark, 0.2)} 0%, ${alpha(theme.palette.background.paper, 0.9)} 100%)`;
        }
        return `linear-gradient(135deg, ${alpha(theme.palette[color].light, 0.1)} 0%, ${alpha(theme.palette.common.white, 0.9)} 100%)`;
    };

    const getStatusDetails = () => {
        if (!status) return null;
        
        const days = getDaysUntilAnniversary(date);
        if (status === 'Today') return { label: 'Today', icon: <Celebration />, gradient: 'linear-gradient(45deg, #4CAF50, #8BC34A)' };
        if (status === 'Tomorrow') return { label: 'Tomorrow', icon: <AccessTime />, gradient: 'linear-gradient(45deg, #FF9800, #FFC107)' };
        if (days < 0) return { label: `${Math.abs(days)} days ago`, icon: null, gradient: 'linear-gradient(45deg, #9E9E9E, #BDBDBD)' };
        return { label: `${days} days left`, icon: null, gradient: 'linear-gradient(45deg, #2196F3, #64B5F6)' };
    };

    const statusDetails = getStatusDetails();

    return (
        <Card sx={{
            position: 'relative',
            overflow: 'visible',
            borderRadius: { xs: 3, sm: 4 },
            background: getGradientBackground(),
            backdropFilter: 'blur(10px)',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: theme.shadows[8],
            },
            height: '100%',
        }}>
            {/* Decorative corner accent */}
            <Box sx={{
                position: 'absolute',
                top: 0,
                right: 0,
                width: { xs: 30, sm: 40 },
                height: { xs: 30, sm: 40 },
                background: `linear-gradient(135deg, transparent 50%, ${theme.palette[color].main} 50%)`,
                borderTopRightRadius: { xs: 12, sm: 16 },
            }} />

            <CardContent sx={{ 
                p: { xs: 1.5, sm: 2.5 },
                position: 'relative',
                zIndex: 1,
            }}>
                {/* Icon and Title Section */}
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    mb: { xs: 1, sm: 2 },
                }}>
                    <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                    }}>
                        <Box sx={{
                            p: { xs: 0.5, sm: 1 },
                            borderRadius: 2,
                            bgcolor: alpha(theme.palette[color].main, 0.1),
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}>
                            {getIcon()}
                        </Box>
                        <Typography 
                            variant="body2" 
                            sx={{
                                color: 'text.secondary',
                                fontWeight: 500,
                                fontSize: { xs: '0.75rem', sm: '0.875rem' },
                                letterSpacing: '0.02em',
                                textTransform: 'uppercase',
                            }}
                        >
                            {title}
                        </Typography>
                    </Box>

                    {/* Mini status indicator for compact view */}
                    {variant === 'compact' && statusDetails && (
                        <Box sx={{
                            width: { xs: 8, sm: 10 },
                            height: { xs: 8, sm: 10 },
                            borderRadius: '50%',
                            background: statusDetails.gradient,
                            boxShadow: `0 0 0 2px ${alpha(theme.palette.background.paper, 0.5)}`,
                        }} />
                    )}
                </Box>

                {/* Main Value Section */}
                <Box sx={{
                    textAlign: 'center',
                    mb: showChip && variant !== 'compact' ? { xs: 1, sm: 2 } : 0,
                }}>
                    {value ? (
                        <Typography 
                            variant={variant === 'compact' ? "h6" : "h5"}
                            sx={{
                                fontWeight: 800,
                                color: theme.palette[color].main,
                                fontSize: { 
                                    xs: variant === 'compact' ? '1.1rem' : '1.3rem',
                                    sm: variant === 'compact' ? '1.3rem' : '1.8rem',
                                },
                                lineHeight: 1.2,
                                textShadow: isDarkMode ? `0 2px 4px ${alpha(theme.palette[color].main, 0.3)}` : 'none',
                            }}
                        >
                            {value}
                        </Typography>
                    ) : (
                        <Typography 
                            variant="body1"
                            sx={{
                                color: 'text.primary',
                                fontWeight: 600,
                                fontSize: { xs: '0.9rem', sm: '1rem' },
                                fontFamily: 'monospace',
                                letterSpacing: '0.5px',
                            }}
                        >
                            {safeFormat(date, 'dd MMM yyyy')}
                        </Typography>
                    )}
                    
                    {/* Subtitle for detailed view */}
                    {variant === 'detailed' && date && (
                        <Typography 
                            variant="caption" 
                            sx={{
                                display: 'block',
                                color: 'text.secondary',
                                mt: 0.5,
                                fontSize: { xs: '0.65rem', sm: '0.75rem' },
                            }}
                        >
                            {safeFormat(date, 'EEEE, MMMM do, yyyy')}
                        </Typography>
                    )}
                </Box>

                {/* Status Chip */}
                {showChip && status && variant !== 'compact' && (
                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        mt: { xs: 1, sm: 1.5 },
                    }}>
                        <Chip
                            size="small"
                            icon={statusDetails?.icon}
                            label={statusDetails?.label}
                            sx={{
                                fontWeight: 700,
                                height: { xs: 24, sm: 28 },
                                background: statusDetails?.gradient,
                                color: 'white',
                                borderRadius: '16px',
                                boxShadow: `0 4px 8px ${alpha(theme.palette.common.black, 0.2)}`,
                                '& .MuiChip-icon': { 
                                    fontSize: { xs: 14, sm: 16 },
                                    color: 'white',
                                },
                                '& .MuiChip-label': {
                                    px: { xs: 1, sm: 1.5 },
                                    fontSize: { xs: '0.7rem', sm: '0.75rem' },
                                },
                            }}
                        />
                    </Box>
                )}

                {/* Progress indicator for upcoming events */}
                {status && status !== 'Today' && status !== 'Tomorrow' && !status.includes('ago') && variant === 'detailed' && (
                    <Box sx={{
                        mt: { xs: 1.5, sm: 2 },
                        width: '100%',
                        height: { xs: 3, sm: 4 },
                        bgcolor: alpha(theme.palette.divider, 0.2),
                        borderRadius: 2,
                        overflow: 'hidden',
                    }}>
                        <Box sx={{
                            width: `${Math.min(100, (30 / parseInt(status)) * 100)}%`,
                            height: '100%',
                            background: `linear-gradient(90deg, ${theme.palette[color].main}, ${theme.palette[color].light})`,
                            borderRadius: 2,
                            transition: 'width 0.3s ease',
                        }} />
                    </Box>
                )}
            </CardContent>
        </Card>
    );
};

export default AnniversaryStatCard;