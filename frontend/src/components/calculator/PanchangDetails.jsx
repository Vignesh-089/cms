import React from 'react';
import { Box, Typography, alpha, useTheme, Paper, Chip } from '@mui/material';
import {
    WbSunny,
    Brightness4,
    CalendarMonth,
    Info,
} from '@mui/icons-material';

const PanchangDetails = ({ details }) => {
    const theme = useTheme();
    const isDarkMode = theme.palette.mode === 'dark';

    const items = [
        { 
            label: 'Tithi', 
            value: details?.tithi,
            icon: <WbSunny />,
            color: 'warning',
            description: 'Lunar day - The phase of the moon',
            gradient: 'linear-gradient(135deg, #FF9800 0%, #FFC107 100%)',
        },
        { 
            label: 'Paksha', 
            value: details?.paksha,
            icon: <Brightness4 />,
            color: 'info',
            description: 'Lunar phase - Bright or dark fortnight',
            gradient: 'linear-gradient(135deg, #2196F3 0%, #64B5F6 100%)',
        },
        { 
            label: 'Masa', 
            value: details?.masa,
            icon: <CalendarMonth />,
            color: 'success',
            description: 'Lunar month - Hindu calendar month',
            gradient: 'linear-gradient(135deg, #4CAF50 0%, #8BC34A 100%)',
        },
    ];

    const styles = {
        container: {
            bgcolor: isDarkMode
                ? alpha(theme.palette.background.paper, 0.3)
                : alpha(theme.palette.background.paper, 0.5),
            backdropFilter: 'blur(12px)',
            borderRadius: { xs: 3, sm: 4 },
            p: { xs: 2, sm: 2.5, md: 3 },
            border: '1px solid',
            borderColor: alpha(theme.palette.divider, 0.1),
            boxShadow: isDarkMode 
                ? '0 12px 40px rgba(0,0,0,0.3)'
                : '0 12px 40px rgba(0,0,0,0.08)',
            position: 'relative',
            overflow: 'hidden',
        },
        header: {
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            mb: { xs: 2, sm: 3 },
        },
        headerIcon: {
            fontSize: { xs: '1.8rem', sm: '2.2rem' },
            background: `linear-gradient(135deg, ${theme.palette.warning.main}, ${theme.palette.error.main})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
        },
        headerText: {
            flex: 1,
        },
        title: {
            fontWeight: 700,
            fontSize: { xs: '1.1rem', sm: '1.3rem' },
            background: `linear-gradient(135deg, ${theme.palette.warning.main}, ${theme.palette.error.main})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            lineHeight: 1.2,
        },
        subtitle: {
            fontSize: { xs: '0.7rem', sm: '0.8rem' },
            color: 'text.secondary',
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
            mt: 0.25,
        },
        grid: {
            display: 'grid',
            gridTemplateColumns: { 
                xs: '1fr', 
                sm: 'repeat(3, 1fr)' 
            },
            gap: { xs: 1.5, sm: 2 },
        },
        card: {
            bgcolor: isDarkMode 
                ? alpha(theme.palette.background.paper, 0.6)
                : alpha(theme.palette.background.paper, 0.8),
            borderRadius: { xs: 2.5, sm: 3 },
            overflow: 'hidden',
            border: '1px solid',
            borderColor: alpha(theme.palette.divider, 0.1),
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: `0 12px 24px ${alpha(theme.palette.common.black, 0.15)}`,
            },
        },
        cardHeader: {
            p: { xs: 1.5, sm: 2 },
            pb: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
        },
        iconWrapper: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: { xs: 40, sm: 48 },
            height: { xs: 40, sm: 48 },
            borderRadius: 2,
            background: (color) => alpha(theme.palette[color].main, 0.12),
        },
        icon: {
            fontSize: { xs: '1.3rem', sm: '1.6rem' },
        },
        label: {
            fontSize: { xs: '0.8rem', sm: '0.9rem' },
            fontWeight: 600,
            color: 'text.primary',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
        },
        cardBody: {
            p: { xs: 1.5, sm: 2 },
            pt: { xs: 1, sm: 1.25 },
        },
        value: {
            fontSize: { xs: '1.2rem', sm: '1.4rem', md: '1.6rem' },
            fontWeight: 800,
            lineHeight: 1.2,
            mb: 1,
        },
        description: {
            fontSize: { xs: '0.7rem', sm: '0.75rem' },
            color: 'text.secondary',
            lineHeight: 1.4,
        },
        decorativeBar: {
            height: 4,
            width: '100%',
            background: (gradient) => gradient,
            opacity: 0.8,
        },
        infoChip: {
            display: 'inline-flex',
            alignItems: 'center',
            gap: 0.5,
            px: 1,
            py: 0.5,
            borderRadius: 1,
            bgcolor: alpha(theme.palette.info.main, 0.08),
            color: theme.palette.info.main,
            fontSize: { xs: '0.65rem', sm: '0.7rem' },
            fontWeight: 600,
        },
        footer: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mt: { xs: 2, sm: 2.5 },
            pt: { xs: 1.5, sm: 2 },
            borderTop: `1px dashed ${alpha(theme.palette.divider, 0.2)}`,
        },
    };

    return (
        <Paper sx={styles.container} elevation={0}>
            {/* Background Decoration */}
            <Box sx={{
                position: 'absolute',
                top: -30,
                right: -30,
                width: { xs: 150, sm: 200 },
                height: { xs: 150, sm: 200 },
                borderRadius: '50%',
                background: `radial-gradient(circle, ${alpha(theme.palette.warning.main, 0.08)} 0%, transparent 70%)`,
                zIndex: 0,
            }} />
            
            <Box sx={{ position: 'relative', zIndex: 1 }}>
                {/* Header */}
                <Box sx={styles.header}>
                    <span style={styles.headerIcon}>🕉️</span>
                    <Box sx={styles.headerText}>
                        <Typography sx={styles.title}>
                            Panchang Details
                        </Typography>
                        <Typography sx={styles.subtitle}>
                            <Info sx={{ fontSize: 14 }} />
                            Based on death date calculations
                        </Typography>
                    </Box>
                    <Chip
                        label="Vedic"
                        size="small"
                        sx={{
                            bgcolor: alpha(theme.palette.warning.main, 0.1),
                            color: theme.palette.warning.main,
                            fontWeight: 600,
                            height: { xs: 24, sm: 28 },
                            fontSize: { xs: '0.7rem', sm: '0.75rem' },
                        }}
                    />
                </Box>

                {/* 3 Cards Grid */}
                <Box sx={styles.grid}>
                    {items.map((item, index) => (
                        <Box key={index} sx={styles.card}>
                            {/* Colored top bar */}
                            <Box sx={{ ...styles.decorativeBar, background: item.gradient }} />
                            
                            {/* Card Header with Icon */}
                            <Box sx={styles.cardHeader}>
                                <Box sx={{
                                    ...styles.iconWrapper,
                                    background: alpha(theme.palette[item.color].main, 0.15),
                                }}>
                                    <Box sx={{
                                        ...styles.icon,
                                        color: theme.palette[item.color].main,
                                    }}>
                                        {item.icon}
                                    </Box>
                                </Box>
                                <Typography sx={styles.label}>
                                    {item.label}
                                </Typography>
                            </Box>

                            {/* Card Body with Value */}
                            <Box sx={styles.cardBody}>
                                <Typography 
                                    sx={{
                                        ...styles.value,
                                        color: theme.palette[item.color].main,
                                    }}
                                >
                                    {item.value || '—'}
                                </Typography>
                                <Typography sx={styles.description}>
                                    {item.description}
                                </Typography>
                            </Box>
                        </Box>
                    ))}
                </Box>

                {/* Footer */}
                <Box sx={styles.footer}>
                    <Box sx={styles.infoChip}>
                        <Box sx={{
                            width: 6,
                            height: 6,
                            borderRadius: '50%',
                            bgcolor: theme.palette.success.main,
                            animation: 'pulse 2s infinite',
                            '@keyframes pulse': {
                                '0%': { opacity: 1, transform: 'scale(1)' },
                                '50%': { opacity: 0.5, transform: 'scale(1.5)' },
                                '100%': { opacity: 1, transform: 'scale(1)' },
                            },
                        }} />
                        Traditional Hindu Calendar
                    </Box>
                </Box>
            </Box>
        </Paper>
    );
};

export default PanchangDetails;