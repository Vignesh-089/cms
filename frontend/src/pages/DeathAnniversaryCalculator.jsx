import React, { useState } from 'react';
import {
    Box,
    Stepper,
    Step,
    StepLabel,
    StepContent,
    useTheme,
    useMediaQuery,
    alpha,
    Container,
    Paper,
    Fade,
    Zoom,
    Typography,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { calculateDeathAnniversary, fetchDeathAnniversaryHistory, saveDeathAnniversary } from "../services/deathAnniversaryService";

// Import components
import BackHeader from '../components/common/BackHeader';
import AlertMessage from '../components/common/AlertMessage';
import Loader from '../components/common/Loader';
import StepIndicator from '../components/calculator/StepIndicator';
import DeathDateStep from '../components/calculator/DeathDateStep';
import ResultsStep from '../components/calculator/ResultsStep';
import ClientDetailsStep from '../components/calculator/ClientDetailsStep';
import ConfirmDialog from '../components/calculator/ConfirmDialog';

// Icons
import {
    CalendarToday,
    Calculate,
    PersonAdd,
} from '@mui/icons-material';

const DeathAnniversaryCalculatorPage = ({ setIsListView }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
    const isDarkMode = theme.palette.mode === 'dark';

    // State for stepper
    const [activeStep, setActiveStep] = useState(0);

    // Form state
    const [formData, setFormData] = useState({
        deathDate: '',
        clientName: '',
        phoneNumber: '',
        occupation: '',
        address: '',
        city: '',
        state: '',
        pincode: '',
        notes: '',
        email: '',
    });

    // Loading states
    const [calculating, setCalculating] = useState(false);
    const [saving, setSaving] = useState(false);

    // Data states
    const [calculationResult, setCalculationResult] = useState(null);
    const [setHistoryData] = useState(null);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    // UI states
    const [confirmDialog, setConfirmDialog] = useState(false);

    // Validation
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});

    // Steps configuration with actual color values
    const steps = [
        {
            label: 'Death Details',
            description: 'Enter the actual date of death',
            icon: <CalendarToday />,
            color: theme.palette.info.main,
            lightColor: alpha(theme.palette.info.main, 0.1),
            gradient: `linear-gradient(135deg, ${theme.palette.info.main} 0%, ${alpha(theme.palette.info.main, 0.7)} 100%)`,
        },
        {
            label: 'Anniversary Results',
            description: 'Review Panchang-based calculations',
            icon: <Calculate />,
            color: theme.palette.success.main,
            lightColor: alpha(theme.palette.success.main, 0.1),
            gradient: `linear-gradient(135deg, ${theme.palette.success.main} 0%, ${alpha(theme.palette.success.main, 0.7)} 100%)`,
        },
        {
            label: 'Client Information',
            description: 'Add optional client details',
            icon: <PersonAdd />,
            color: theme.palette.warning.main,
            lightColor: alpha(theme.palette.warning.main, 0.1),
            gradient: `linear-gradient(135deg, ${theme.palette.warning.main} 0%, ${alpha(theme.palette.warning.main, 0.7)} 100%)`,
        },
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const handleBlur = (e) => {
        const { name } = e.target;
        setTouched(prev => ({ ...prev, [name]: true }));
        validateField(name);
    };

    const validateField = (fieldName) => {
        const value = formData[fieldName];
        const newErrors = { ...errors };

        switch (fieldName) {
            case 'deathDate':
                if (!value) {
                    newErrors.deathDate = 'Death date is required';
                } else {
                    const date = new Date(value);
                    if (date > new Date()) {
                        newErrors.deathDate = 'Death date cannot be in the future';
                    } else {
                        delete newErrors.deathDate;
                    }
                }
                break;
            case 'email':
                if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                    newErrors.email = 'Invalid email format';
                } else {
                    delete newErrors.email;
                }
                break;
            case 'phoneNumber':
                if (value && !/^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,4}[-\s.]?[0-9]{1,9}$/.test(value)) {
                    newErrors.phoneNumber = 'Invalid phone number';
                } else {
                    delete newErrors.phoneNumber;
                }
                break;
            default:
                break;
        }

        setErrors(newErrors);
    };

    const validateStep = (step) => {
        if (step === 0) {
            if (!formData.deathDate) {
                setErrors(prev => ({ ...prev, deathDate: 'Death date is required' }));
                return false;
            }
            return true;
        }
        return true;
    };

    const handleCalculate = async () => {
        if (!validateStep(0)) return;

        setCalculating(true);
        setError(null);

        try {
            const res = await calculateDeathAnniversary({
                deathDate: formData.deathDate,
                clientName: formData.clientName,
                phoneNumber: formData.phoneNumber,
            });

            if (res.data.success) {
                setCalculationResult(res.data.data);
                setActiveStep(1);
                fetchHistory();
            }
        } catch (err) {
            setError(err.response?.data?.message || "Failed to calculate anniversary");
        } finally {
            setCalculating(false);
        }
    };

    const fetchHistory = async () => {
        // setLoadingHistory(true);
        try {
            const res = await fetchDeathAnniversaryHistory({
                deathDate: formData.deathDate,
                years: 5
            });

            if (res.data.success) {
                setHistoryData(res.data.data);
            }
        } catch (err) {
            console.error('Failed to fetch history:', err);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        setError(null);

        try {
            const res = await saveDeathAnniversary({
                full_name: formData.clientName || 'Unknown Client',
                clientName: formData.clientName,
                phone_number: formData.phoneNumber,
                email: formData.email,
                occupation: formData.occupation,
                address: formData.address,
                city: formData.city,
                state: formData.state,
                pincode: formData.pincode,
                notes: formData.notes,
                deathDate: formData.deathDate,
                death_tithi: calculationResult?.panchang_details?.tithi,
                death_paksha: calculationResult?.panchang_details?.paksha,
                death_masa: calculationResult?.panchang_details?.masa,
                calculated_anniversary_date: calculationResult?.current_year_anniversary,
            });

            if (res.data.success) {
                setSuccess(true);
                setTimeout(() => {
                    setConfirmDialog(false);
                    setIsListView(true);
                }, 1500);
            }
        } catch (err) {
            setError(err.response?.data?.message || "Failed to save client");
        } finally {
            setSaving(false);
        }
    };

    const handleReset = () => {
        setFormData({
            deathDate: '',
            clientName: '',
            phoneNumber: '',
            email: '',
            occupation: '',
            address: '',
            city: '',
            state: '',
            pincode: '',
            notes: '',
        });
        setCalculationResult(null);
        setHistoryData(null);
        setActiveStep(0);
        setErrors({});
        setTouched({});
    };

    const handleBack = () => {
        setIsListView(true);
    };

    if (calculating && activeStep === 0) {
        return <Loader message="Calculating anniversary..." fullScreen />;
    };

    return (
        <Box sx={{
            minHeight: '100vh',
            background: isDarkMode
                ? `linear-gradient(145deg, ${alpha(theme.palette.common.black, 0.98)} 0%, ${alpha(theme.palette.primary.dark, 0.1)} 100%)`
                : `linear-gradient(145deg, ${theme.palette.grey[50]} 0%, ${alpha(theme.palette.primary.light, 0.05)} 100%)`,
            position: 'relative',
            overflow: 'hidden',
        }}>
            {/* Decorative Background Elements */}
            <Box sx={{
                position: 'fixed',
                width: { xs: 300, sm: 400, md: 500 },
                height: { xs: 300, sm: 400, md: 500 },
                borderRadius: '50%',
                background: `radial-gradient(circle, ${alpha(theme.palette.primary.main, 0.08)} 0%, transparent 70%)`,
                top: -100,
                right: -100,
                zIndex: 0,
                pointerEvents: 'none',
            }} />
            <Box sx={{
                position: 'fixed',
                width: { xs: 400, sm: 500, md: 600 },
                height: { xs: 400, sm: 500, md: 600 },
                borderRadius: '50%',
                background: `radial-gradient(circle, ${alpha(theme.palette.success.main, 0.05)} 0%, transparent 70%)`,
                bottom: -200,
                left: -200,
                zIndex: 0,
                pointerEvents: 'none',
            }} />

            <Container maxWidth={false} sx={{
                position: 'relative',
                zIndex: 1,
                maxWidth: { xs: '100%', sm: '90%', md: 1200 },
                mx: 'auto',
                px: { xs: 1, sm: 2, md: 3 },
                py: { xs: 2, sm: 3, md: 4 },
            }}>
                {/* Header */}
                <Zoom in timeout={500}>
                    <Box>
                        <BackHeader 
                            title="Death Anniversary Calculator"
                            subtitle="Calculate Panchang-based anniversary dates with precision"
                            onBack={handleBack}
                            showReset={!!calculationResult}
                            onReset={handleReset}
                        />
                    </Box>
                </Zoom>

                {/* Alerts */}
                <AnimatePresence>
                    {error && (
                        <AlertMessage
                            open={!!error}
                            type="error"
                            message={error}
                            onClose={() => setError(null)}
                        />
                    )}
                    {success && (
                        <AlertMessage
                            open={success}
                            type="success"
                            message="Death anniversary saved successfully! Redirecting..."
                            onClose={() => setSuccess(false)}
                        />
                    )}
                </AnimatePresence>

                {/* Stepper Section */}
                <Fade in timeout={800}>
                    <Box sx={{
                        mb: { xs: 3, sm: 4, md: 5 },
                        position: 'relative',
                        zIndex: 2,
                    }}>
                        <Paper elevation={0} sx={{
                            bgcolor: isDarkMode
                                ? alpha(theme.palette.background.paper, 0.3)
                                : alpha(theme.palette.background.paper, 0.6),
                            backdropFilter: 'blur(10px)',
                            borderRadius: { xs: 3, sm: 4 },
                            p: { xs: 1.5, sm: 2, md: 3 },
                            border: '1px solid',
                            borderColor: alpha(theme.palette.divider, 0.1),
                        }}>
                            <Stepper
                                activeStep={activeStep}
                                orientation={isMobile ? 'vertical' : 'horizontal'}
                                alternativeLabel={!isMobile && isTablet}
                                connector={!isMobile && (
                                    <Box sx={{
                                        flex: 1,
                                        height: 2,
                                        mx: 1,
                                        background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${alpha(theme.palette.primary.main, 0.3)} 100%)`,
                                        borderRadius: 1,
                                    }} />
                                )}
                            >
                                {steps.map((step, index) => (
                                    <Step key={step.label}>
                                        <StepLabel 
                                            StepIconComponent={() => (
                                                <StepIndicator
                                                    index={index}
                                                    activeStep={activeStep}
                                                    color={step.color}
                                                    icon={step.icon}
                                                />
                                            )}
                                        >
                                            <StepIndicator.Label 
                                                label={step.label}
                                                description={step.description}
                                                isMobile={isMobile}
                                                isActive={activeStep === index}
                                                isCompleted={activeStep > index}
                                                color={step.color}
                                            />
                                        </StepLabel>
                                        {isMobile && (
                                            <StepContent>
                                                <StepIndicator.Description description={step.description} />
                                            </StepContent>
                                        )}
                                    </Step>
                                ))}
                            </Stepper>
                        </Paper>
                    </Box>
                </Fade>

                {/* Step Content */}
                <Box sx={{
                    mt: { xs: 3, sm: 4 },
                    position: 'relative',
                    zIndex: 2,
                }}>
                    <AnimatePresence mode="wait">
                        {activeStep === 0 && (
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ duration: 0.3 }}
                            >
                                <DeathDateStep
                                    formData={formData}
                                    errors={errors}
                                    touched={touched}
                                    onchange={handleChange}
                                    onBlur={handleBlur}
                                    onCalculate={handleCalculate}
                                    calculating={calculating}
                                />
                            </motion.div>
                        )}

                        {activeStep === 1 && calculationResult && (
                            <motion.div
                                key="step2"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3 }}
                            >
                                <ResultsStep
                                    calculationResult={calculationResult}
                                    onContinue={() => setActiveStep(2)}
                                />
                            </motion.div>
                        )}

                        {activeStep === 2 && (
                            <motion.div
                                key="step3"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3 }}
                            >
                                <ClientDetailsStep
                                    formData={formData}
                                    onChange={handleChange}
                                    onBack={() => setActiveStep(1)}
                                    onReset={handleReset}
                                    onSave={() => setConfirmDialog(true)}
                                    saving={saving}
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </Box>

                {/* Progress Indicator */}
                {activeStep < steps.length && (
                    <Fade in timeout={1000}>
                        <Paper
                            elevation={3}
                            sx={{
                                position: 'fixed',
                                bottom: { xs: 16, sm: 24 },
                                right: { xs: 16, sm: 24 },
                                zIndex: 10,
                                display: { xs: 'none', sm: 'block' },
                                p: 1.5,
                                borderRadius: 3,
                                bgcolor: alpha(theme.palette.background.paper, 0.8),
                                backdropFilter: 'blur(10px)',
                                border: '1px solid',
                                borderColor: alpha(theme.palette.primary.main, 0.2),
                            }}
                        >
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                <Box sx={{
                                    width: 40,
                                    height: 40,
                                    borderRadius: 2,
                                    bgcolor: alpha(steps[activeStep].color, 0.1),
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: steps[activeStep].color,
                                }}>
                                    {steps[activeStep].icon}
                                </Box>
                                <Box>
                                    <Typography variant="body2" fontWeight={600}>
                                        Step {activeStep + 1} of {steps.length}
                                    </Typography>
                                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                        {steps[activeStep].label}
                                    </Typography>
                                </Box>
                            </Box>
                        </Paper>
                    </Fade>
                )}
            </Container>

            {/* Confirm Dialog */}
            <ConfirmDialog
                open={confirmDialog}
                onClose={() => setConfirmDialog(false)}
                onConfirm={handleSave}
                saving={saving}
                deathDate={formData.deathDate}
                anniversaryDate={calculationResult?.current_year_anniversary}
            />
        </Box>
    );
};

export default DeathAnniversaryCalculatorPage;