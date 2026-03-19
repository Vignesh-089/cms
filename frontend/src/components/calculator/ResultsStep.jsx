import React from 'react';
import {
    Grid,
    Box,
    Button,
    useTheme,
    alpha,
} from '@mui/material';
import { Save } from '@mui/icons-material';
import AnniversaryStatCard from './AnniversaryStatCard';
import PanchangDetails from './PanchangDetails';
import HistorySidebar from './HistorySidebar';

const ResultsStep = ({
    calculationResult,
    historyData,
    loadingHistory,
    showHistory,
    onToggleHistory,
    onContinue
}) => {
    const theme = useTheme();

    return (
        <Grid container spacing={3}>
            {/* Main Result Card */}
            <Grid item xs={12} lg={showHistory ? 8 : 12}>
                <Box sx={{
                    p: { xs: 2, sm: 2.5, md: 3 },
                    borderRadius: 2.5,
                    background: theme.palette.mode === 'dark'
                        ? `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.2)} 0%, ${alpha(theme.palette.primary.dark, 0.1)} 100%)`
                        : `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.primary.dark, 0.05)} 100%)`,
                    border: '2px solid',
                    borderColor: alpha(theme.palette.primary.main, 0.3),
                }}>
                    <Grid container spacing={2}>
                        {/* Stats */}
                        <Grid item xs={12} sm={6}>
                            <AnniversaryStatCard
                                title="Death Date"
                                date={calculationResult.death_date}
                                color="error"
                            />
                        </Grid>
                        
                        <Grid item xs={12} sm={6}>
                            <AnniversaryStatCard
                                title="This Year's Anniversary"
                                date={calculationResult.current_year_anniversary}
                                color="primary"
                                showChip={true}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <PanchangDetails 
                                details={calculationResult.panchang_details} 
                            />
                        </Grid>

                        {/* Actions */}
                        <Grid item xs={12}>
                            <Box sx={{ 
                                display: 'flex', 
                                justifyContent: 'flex-end', 
                                gap: 2, 
                                mt: 2,
                                flexDirection: { xs: 'column', sm: 'row' },
                            }}>
                                <Button
                                    variant="contained"
                                    startIcon={<Save />}
                                    onClick={onContinue}
                                    sx={{
                                        borderRadius: 2,
                                        textTransform: 'none',
                                        height: { xs: 44, sm: 48 },
                                        width: { xs: '100%', sm: 'auto' },
                                        background: `linear-gradient(135deg, ${theme.palette.success.main} 0%, ${theme.palette.success.dark} 100%)`,
                                    }}
                                >
                                    Continue to Add Client
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
            </Grid>

            {/* History Sidebar */}
            {showHistory && (
                <Grid item xs={12} lg={4}>
                    <HistorySidebar
                        historyData={historyData}
                        loading={loadingHistory}
                    />
                </Grid>
            )}
        </Grid>
    );
};

export default ResultsStep;