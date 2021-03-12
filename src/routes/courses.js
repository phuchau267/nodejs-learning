const express = require('express');
const router = express.Router();

const CourseController = require('../app/controllers/CourseController');
const UserController = require('../app/controllers/UserController');
// route chinh' luon nam o duoi cung

router.post('/store',CourseController.store);

router.get('/create', CourseController.create);
router.post('/handle-form-action', CourseController.handleFormAction)
router.get('/:slug', CourseController.show);

router.get('/:id/edit', CourseController.edit);

router.put('/:id', CourseController.update);
router.patch('/:id/restore', CourseController.restore);

router.delete('/:id', CourseController.destroy);
router.delete('/:id/force', CourseController.forcedestroy);

router.get('/',UserController.checkLogin, CourseController.index);



module.exports = router;
