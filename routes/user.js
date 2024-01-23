const express = require('express');
const UserController = require('../controllers/UserController');
const authorizationAccept = require("../middlewares/authorization/authorizationAccept");
const {checkPassword, checkEmail} = require('../middlewares/change_userinfo/check');
const {passwordValidator, nameValidator, emailValidator} = require('../middlewares/change_userinfo/validator');
const router = express.Router();

/* POST, PUT and GET users listing. */
router.get('/get', authorizationAccept, UserController.getUser);
router.delete('/remove', authorizationAccept, UserController.removeUser);

router.put('/change-name', authorizationAccept, nameValidator, UserController.changeName);
router.put('/change-email', authorizationAccept, emailValidator, checkEmail, UserController.changeEmail);
router.put('/change-password', authorizationAccept, passwordValidator, checkPassword, UserController.changePassword);

module.exports = router;