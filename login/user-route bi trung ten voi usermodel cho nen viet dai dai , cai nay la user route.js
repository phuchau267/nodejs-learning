const express = require('express');
const router = express.Router();
const passport = require('passport');
// Load User model
const { User } = require('../app/models/User');
// Load Controller
const UserController = require('../app/controllers/UserController');
const Sitecontroller = require('../app/controllers/SiteController');
// Load Middleware
const { forwardAuthenticated, ensureAuthenticated } = require('../config/auth/auth');

/** Route **/
// Login Page
router.get('/login', forwardAuthenticated, UserController.loginPage);
// Login 
router.post('/login', UserController.login);
// Logout 
router.get('/logout', UserController.logout);
// Register Page
router.get('/register', forwardAuthenticated, UserController.registerPage);
// Register 
router.post('/register', UserController.register);
// Change Role to extraAdmin or User
router.put('/changerole/:role/:userId', UserController.changeRole);
// Ban User
router.put('/changeStatus/:banType/:userId', UserController.changeBannedStatus);
// Delete User
router.delete('/deleteUser/:userId', UserController.deleteUser);

router.get('/facebook/login', passport.authenticate('facebook',{
    scope: ['email']
}));
router.get('/facebook/callback',passport.authenticate('facebook'),ensureAuthenticated, Sitecontroller.index);

router.get('/google/login', passport.authenticate('google',{
    scope: ['profile']
}));
router.get('/google/callback',passport.authenticate('google'),ensureAuthenticated, Sitecontroller.index);

module.exports = router;
