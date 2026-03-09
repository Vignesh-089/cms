const express = require('express');
const router = express.Router();

const { getPanchangByDate } = require('../controllers/panchangController');

router.get('/getPanchangByDate', getPanchangByDate);

module.exports = router;