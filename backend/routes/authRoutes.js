const express = require('express');
const router = express.Router();
const {
    login,
    getProfile,
    changePassword,
    verifyToken,
    logout,
    getUserDetailsForSetting
} = require('../controllers/authController');
const { protect, checkAdminExists } = require('../middleware/authMiddleware');

// Public route
router.post('/login', login);

// Protected routes
router.use(protect); // Apply authentication to all routes below
router.use(checkAdminExists); // Optional: verify admin still exists

router.get('/profile', getProfile);
router.put('/change-password', changePassword);
router.post('/verify-token', verifyToken);
router.post('/logout', logout);
router.get('/getUserDetailsForSetting', getUserDetailsForSetting);

module.exports = router;