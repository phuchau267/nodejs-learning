const express = require('express');
const router = express.Router();

const newsController = require('../app/controllers/NewsController');
// route chinh' luon nam o duoi cung

router.get('/:slug', newsController.show);

router.get('/', newsController.index);

module.exports = router;
