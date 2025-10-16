const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const { auth, authorize } = require('../middlewares/auth');

router.get('/', auth, authorize('admin', 'manager'), reportController.getReports);

module.exports = router;