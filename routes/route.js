const express = require('express');
const profilesRoutes = require('../api/profiles/index');

const router = express.Router();
router.use('/', profilesRoutes);

module.exports = router;
