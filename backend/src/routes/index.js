const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const sesiuneRoutes = require('./sesiuneRoutes');
const cerereRoutes = require('./cerereRoutes');
const fisiereRoutes = require('./fisiereRoutes');

router.use('/auth', authRoutes);
router.use('/sesiuni', sesiuneRoutes);
router.use('/cereri', cerereRoutes);
router.use('/fisiere', fisiereRoutes);

module.exports = router;