const express = require('express');
const router = express.Router();

const ComicController = require('../app/controllers/ComicController');
const UserController = require('../app/controllers/UserController');
// route chinh' luon nam o duoi cung

router.post('/store',ComicController.store);

router.get('/create', ComicController.create);

router.get('/:slug',UserController.checkLogin, ComicController.show);

router.get('/:id/edit', ComicController.edit);

router.put('/:id', ComicController.update);
router.patch('/:id/restore', ComicController.restore);

router.delete('/:id', ComicController.destroy);
router.delete('/:id/force', ComicController.forcedestroy);

router.get('/',UserController.checkLogin, ComicController.index);



module.exports = router;
