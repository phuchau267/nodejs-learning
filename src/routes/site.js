const express = require('express');
const router = express.Router();

const siteController = require('../app/controllers/SiteController');
const UserController = require('../app/controllers/UserController');

// route chinh' luon nam o duoi cung

router.get('/search', siteController.search);

router.get('/', siteController.index);

router.get('/sign-up', UserController.signup);
router.post('/sign-up', UserController.createUser);

router.get('/login', UserController.login);
router.post('/login', UserController.loginUser);


module.exports = router;
