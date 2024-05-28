const express = require("express");
const router = express.Router();
const userController = require('../controller/user/userController');

router.get('/', userController.getUser);

router.post('/', userController.postUser);

router.put('/', userController.putUser);

router.delete('/', userController.deleteUser);

module.exports = router