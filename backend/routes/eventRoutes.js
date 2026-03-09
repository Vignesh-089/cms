const express = require('express');
const router = express.Router();
const multer = require("multer");

const {
    getAllEvents,
    uploadYearlyPanchang
} = require('../controllers/eventController');

const { protect } = require('../middleware/authMiddleware');

// memory storage
const upload = multer({
    storage: multer.memoryStorage()
});

router.use(protect);

router.get('/getAllEventDetails', getAllEvents);

// Upload yearly panchang
router.post(
    '/upload-panchang/:year',
    upload.single("file"),
    uploadYearlyPanchang
);

module.exports = router;