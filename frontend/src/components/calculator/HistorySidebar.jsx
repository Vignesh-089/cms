import React, { useState } from 'react';
import {
    Paper,
    Box,
    Typography,
    Chip,
    CircularProgress,
    alpha,
    useTheme,
} from '@mui/material';
import { History, DateRange } from '@mui/icons-material';
import { safeFormat } from '../../utils/dateHelpers';

const HistorySidebar = ({ historyData, loading }) => {
    const theme = useTheme();
    const [hoveredItem, setHoveredItem] = useState(null);

    const styles = {
        paper: {
            p: { xs: 1.5, sm: 2 },
            borderRadius: 2.5,
            bgcolor: theme.palette.mode === 'dark'
                ? alpha(theme.palette.background.paper, 0.9)
                : 'background.paper',
        },
        header: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            mb: 2,
            flexWrap: 'wrap',
            gap: 1,
        },
        title: {
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            fontSize: { xs: '0.9rem', sm: '1rem' },
            fontWeight: 600,
        },
        list: {
            maxHeight: { xs: 250, sm: 300 },
            overflow: 'auto',
            '&::-webkit-scrollbar': {
                width: 6,
            },
            '&::-webkit-scrollbar-track': {
                background: theme.palette.action.hover,
                borderRadius: 3,
            },
            '&::-webkit-scrollbar-thumb': {
                background: theme.palette.primary.main,
                borderRadius: 3,
            },
        },
        item: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            p: { xs: 1, sm: 1.5 },
            borderBottom: `1px solid ${alpha(theme.palette.divider, 0.8)}`,
            transition: 'all 0.2s ease',
            cursor: 'pointer',
            '&:hover': {
                bgcolor: alpha(theme.palette.primary.main, 0.05),
                transform: 'translateX(4px)',
            },
            '&:last-child': {
                borderBottom: 'none',
            },
        },
    };

    if (loading) {
        return (
            <Paper sx={styles.paper}>
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                    <CircularProgress size={40} />
                </Box>
            </Paper>
        );
    }

    return (
        <Paper sx={styles.paper}>
            <Box sx={styles.header}>
                <Typography sx={styles.title}>
                    <History fontSize="small" />
                    Previous Years
                </Typography>
                <Chip
                    label="Last 5 years"
                    size="small"
                    icon={<DateRange />}
                    sx={{
                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                        color: 'primary.main',
                        height: { xs: 24, sm: 28 },
                    }}
                />
            </Box>

            {historyData?.history?.length > 0 ? (
                <Box sx={styles.list}>
                    {historyData.history.map((item, index) => (
                        <Box 
                            key={index} 
                            sx={styles.item}
                            onMouseEnter={() => setHoveredItem(index)}
                            onMouseLeave={() => setHoveredItem(null)}
                        >
                            <Typography 
                                variant="body2" 
                                fontWeight={500}
                                sx={{
                                    color: hoveredItem === index ? 'primary.main' : 'text.primary',
                                    fontSize: { xs: '0.8rem', sm: '0.875rem' },
                                }}
                            >
                                {item.year}
                            </Typography>
                            <Chip
                                label={safeFormat(item.anniversary_date, 'dd MMM')}
                                size="small"
                                color={hoveredItem === index ? "primary" : "default"}
                                variant={hoveredItem === index ? "filled" : "outlined"}
                                sx={{ height: { xs: 22, sm: 24 } }}
                            />
                        </Box>
                    ))}
                </Box>
            ) : (
                <Box sx={{ 
                    textAlign: 'center', 
                    py: 4,
                    color: 'text.secondary',
                }}>
                    <History sx={{ fontSize: 40, opacity: 0.3, mb: 1 }} />
                    <Typography variant="body2">
                        No historical data available
                    </Typography>
                </Box>
            )}
        </Paper>
    );
};

export default HistorySidebar;