const express = require('express');
const router = express.Router();
const { getLastTenDaysClientDetails, getLastTenDeathAnniversaryDetails, getDashboardStats, getEventDistribution } = require('./../controllers/dashboardController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/getLastTenDaysClientDetails', getLastTenDaysClientDetails);
router.get('/getLastTenDeathAnniversaryDetails', getLastTenDeathAnniversaryDetails);
router.get('/getDashboardStats', getDashboardStats);
router.get('/getEventDistribution', getEventDistribution);

module.exports = router;