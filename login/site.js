const express = require('express');
const router = express.Router();
const passport = require('passport');
const siteController = require('../app/controllers/SiteController');
const UserController = require('../app/controllers/UserController');

// route chinh' luon nam o duoi cung

router.get('/search', siteController.search);

router.get('/', siteController.index);

router.get('/register', UserController.register);
router.post('/register', UserController.createUser);

router.get('/login', UserController.login);
router.post('/login',UserController.loginUser);

router.post('/followComic/:slug',UserController.checkLogin,UserController.followComic)
router.post('/unfollowComic/:slug',UserController.checkLogin,UserController.unFollowComic)

router.post('/likeComic/:slug',UserController.checkLogin,UserController.likeComic)
router.post('/unlikeComic/:slug',UserController.checkLogin,UserController.unlikeComic)
router.post('/dislikeComic/:slug',UserController.checkLogin,UserController.dislikeComic)
router.post('/undislikeComic/:slug',UserController.checkLogin,UserController.undislikeComic)

router.get('/test-user', UserController.testUser);

router.get('/facebook/login', passport.authenticate('facebook',{
    scope: ['email']
}));
router.get('/facebook/callback',passport.authenticate('facebook'),UserController.checkLogin, UserController.testUser);

router.get('/google/login', passport.authenticate('google',{
    scope: ['profile']
}));
router.get('/google/callback',passport.authenticate('google'),UserController.checkLogin, UserController.testUser);
router.get('/logout', UserController.logout)
module.exports = router;
