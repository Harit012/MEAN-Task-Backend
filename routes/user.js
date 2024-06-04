const express = require("express");
const router = express.Router();
const userController = require('../controller/user/userController');
const cardController = require('../controller/user/cardController');

//User routes

router.get('/', userController.getUser);

router.post('/', userController.postUser);

router.put('/', userController.putUser);

router.delete('/', userController.deleteUser);

// card routes

router.post('/card', cardController.postCard);

router.delete('/card', cardController.deletecard);

router.post('/card/default', cardController.setDefault);

module.exports = router