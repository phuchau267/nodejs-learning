const express = require('express');
const router = express.Router();

const MeController = require('../app/controllers/MeController');
// route chinh' luon nam o duoi cung

router.get('/stored/courses', MeController.storedCourses);
router.get('/trash/courses', MeController.trashCourses);





module.exports = router;