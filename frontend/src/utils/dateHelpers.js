import { format, differenceInDays, isValid } from 'date-fns';

// Safely format dates
export const safeFormat = (dateStr, formatStr, defaultValue = '—') => {
    if (!dateStr) return defaultValue;
    try {
        const date = new Date(dateStr);
        if (!isValid(date)) return defaultValue;
        return format(date, formatStr);
    } catch (error) {
        console.error('Date formatting error:', error);
        return defaultValue;
    }
};

// Safely parse dates
export const safeParseDate = (dateStr) => {
    if (!dateStr) return null;
    try {
        const date = new Date(dateStr);
        return isValid(date) ? date : null;
    } catch {
        return null;
    }
};

// Get days until anniversary
export const getDaysUntilAnniversary = (dateStr) => {
    if (!dateStr) return null;
    try {
        const annivDate = safeParseDate(dateStr);
        if (!annivDate) return null;
        
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        annivDate.setHours(0, 0, 0, 0);
        
        const diffDays = differenceInDays(annivDate, today);
        
        if (diffDays < 0) return 'Past';
        if (diffDays === 0) return 'Today';
        if (diffDays === 1) return 'Tomorrow';
        return `${diffDays} days left`;
    } catch {
        return null;
    }
};

// Get status color based on days
export const getStatusColor = (status, theme) => {
    if (!status) return 'default';
    if (status === 'Today') return 'success';
    if (status === 'Tomorrow') return 'warning';
    if (status.includes('days left')) {
        const num = parseInt(status);
        if (num <= 7) return 'warning';
        if (num <= 30) return 'info';
    }
    return 'default';
};

// Get status icon
export const getStatusIcon = (status) => {
    if (!status) return null;
    if (status === 'Today') return '🎉';
    if (status === 'Tomorrow') return '⏰';
    return null;
};