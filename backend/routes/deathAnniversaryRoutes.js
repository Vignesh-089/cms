const express = require('express');
const router = express.Router();
const {
    calculateDeathAnniversary,
    getDeathAnniversaryHistory,
    saveDeathAnniversaryAsEvent
} = require('../controllers/deathAnniversaryController');

const { protect } = require('../middleware/authMiddleware');

router.use(protect);

// Calculate death anniversary from actual death date
router.post('/calculate', calculateDeathAnniversary);

// Get historical anniversary dates
router.post('/history', getDeathAnniversaryHistory);

// Save as client/event
router.post('/save', saveDeathAnniversaryAsEvent);

module.exports = router;