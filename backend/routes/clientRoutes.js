const express = require('express');
const router = express.Router();
const {
    createOrUpdateClient,
    getAllClients,
    getClientById,
    deleteClient
} = require('../controllers/clientController');

const { protect } = require('../middleware/authMiddleware');

// Protect all routes
router.use(protect);

router.put('/createUpdateClient', createOrUpdateClient);
router.get('/getAllClients', getAllClients);
router.get('/getClientById/:id', getClientById);
router.delete('/deleteClient/:id', deleteClient);

module.exports = router;