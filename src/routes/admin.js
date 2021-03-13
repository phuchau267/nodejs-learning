const express = require('express');
const router = express.Router();
const AdminController = require('../app/controllers/AdminController');
const UserController = require('../app/controllers/UserController');

router.get('/users',UserController.checkLogin, AdminController.checkAdmin, AdminController.users);
router.get('/extraAdmin',UserController.checkLogin, AdminController.checkAdmin, AdminController.extraAdmin);
router.get('/banned',UserController.checkLogin, AdminController.checkAdmin, AdminController.banned);
router.put('/users/:id/ban',UserController.checkLogin, AdminController.checkAdmin, AdminController.banUser)
router.delete('/users/:id/force',UserController.checkLogin, AdminController.checkAdmin, AdminController.deleteUser)
router.put('/users/:id',UserController.checkLogin, AdminController.checkAdmin, AdminController.addAdmin)
router.put('/users/:id/restore',UserController.checkLogin, AdminController.checkAdmin, AdminController.unBan)
router.put('/extraAdmin/:id/unAdmin',UserController.checkLogin, AdminController.checkAdmin, AdminController.unAdmin)
router.put('/extraAdmin/:id/banAdmin',UserController.checkLogin, AdminController.checkAdmin, AdminController.banAdmin)

module.exports = router;