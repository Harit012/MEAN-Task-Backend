const express = require("express");
const router = express.Router();
const userController = require('../controller/user/userController');
const cardController = require('../controller/user/cardController');
const middlewares = require('../middlewares/Params check/user');
let {validate} = require("../middlewares/Field validators/login");
let rules = require("../middlewares/Field validators/user");

//User routes

router.get('/',middlewares.getUsersParamsCheck,rules.getUserValidationRules(),validate, userController.getUser);

router.post('/',middlewares.postUsersParamsCheck,rules.addUserValidationRules(),validate, userController.postUser);

router.put('/',middlewares.putUserParamsCheck,rules.putUserValidationRules(),validate, userController.putUser);

router.delete('/',middlewares.deleteUserParamsCheck,rules.deleteUserValidationRules(),validate, userController.deleteUser);

// card routes

router.post('/card',middlewares.postCardParamsCheck,rules.cardValidationRules(),validate, cardController.postCard);

router.delete('/card',middlewares.deleteCardParamsCheck,rules.cardValidationRules(),validate, cardController.deletecard);

router.post('/card/default',middlewares.defaultCardParamsCheck,rules.cardValidationRules(),validate, cardController.setDefault);

module.exports = router
