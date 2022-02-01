const express = require('express');

const testController = require('../controllers/test')

const router = express.Router('../controllers/test');

router.get('/', testController.test);

module.exports = router;