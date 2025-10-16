const express = require('express');
const router = express.Router();
const machineController = require('../controllers/machineController');
const { auth, authorize } = require('../middlewares/auth');

router.get('/', auth, machineController.getAllMachines);
router.post('/', auth, authorize('admin', 'manager'), machineController.createMachine);
router.put('/:id/status', auth, machineController.updateMachineStatus);

module.exports = router;