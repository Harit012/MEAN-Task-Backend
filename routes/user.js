const express = require("express");
const router = express.Router();
const userController = require('../controller/user/userController');
const cardController = require('../controller/user/cardController');
const middlewares = require('../middlewares/user');

//User routes

router.get('/',middlewares.getUsersParamsCheck, userController.getUser);

router.post('/',middlewares.postUsersParamsCheck, userController.postUser);

router.put('/',middlewares.putUserParamsCheck, userController.putUser);

router.delete('/',middlewares.deleteUserParamsCheck,userController.deleteUser);

// card routes

router.post('/card',middlewares.postCardParamsCheck, cardController.postCard);

router.delete('/card',middlewares.deleteCardParamsCheck, cardController.deletecard);

router.post('/card/default',middlewares.defaultCardParamsCheck, cardController.setDefault);

module.exports = router