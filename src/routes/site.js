const express = require('express');
const router = express.Router();

const siteController = require('../app/controllers/SiteController');
const UserController = require('../app/controllers/UserController');

// route chinh' luon nam o duoi cung

router.get('/search', siteController.search);

router.get('/', siteController.index);

router.get('/register', UserController.register);
router.post('/register', UserController.createUser);

router.get('/login', UserController.login);
router.post('/login',UserController.loginUser);

router.post('/likedComic/:slug',UserController.checkLogin,UserController.likedComic)
router.post('/likedComic/:slug/delete',UserController.checkLogin,UserController.unLikedComic)

router.get('/test-user', UserController.testUser);

router.get('/logout', UserController.logout)
module.exports = router;
