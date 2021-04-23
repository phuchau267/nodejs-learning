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
router.get('/storedComics',UserController.checkLogin, AdminController.checkAdmin, AdminController.storedComics);
router.get('/trashedComics',UserController.checkLogin, AdminController.checkAdmin, AdminController.trashedComics);
router.post('/comics/handle-form-action',UserController.checkLogin, AdminController.checkAdmin, AdminController.comicsHandleFormAction)
router.post('/users/handle-form-action',UserController.checkLogin, AdminController.checkAdmin, AdminController.usersHandleFormAction)
module.exports = router;