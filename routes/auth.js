const express = require('express');
const AuthController = require('../controllers/AuthController');
const checkEmail = require("../middlewares/register/checkEmail");
const registerValidator = require("../middlewares/register/registerValidator");
const {loginValidator, loginOtherValidator, confirmValidation} = require("../middlewares/login/loginValidator");
const checkUser = require("../middlewares/login/checkUser");
const checkAddress = require("../middlewares/login/checkAddress");
const checkNewClientAddress = require("../middlewares/login/checkNewClientAddress");
const checkToken = require("../middlewares/login/checkToken");
const forgotValidator = require("../middlewares/forgot_password/forgotValidator");
const authorizationIgnore = require("../middlewares/authorization/authorizationIgnore");
const authorizationAccept = require("../middlewares/authorization/authorizationAccept");
const check = require('../middlewares/forgot_password/check');
const router = express.Router();

/* POST, PUT and GET auth listing. */

router.post('/login', authorizationIgnore, loginValidator, checkUser, checkAddress, checkToken, AuthController.login);
router.post('/login-other-client', authorizationIgnore, loginOtherValidator, checkUser, checkNewClientAddress, checkToken, AuthController.login);

router.post('/register', authorizationIgnore, registerValidator, checkEmail, AuthController.register);
router.put('/forgot-password', authorizationIgnore, forgotValidator, check, AuthController.forgot);

router.get('/logout', authorizationAccept, AuthController.logout);

router.get('/confirm/:email/:activateKey', authorizationIgnore, confirmValidation, AuthController.confirmEmail);
router.post('/receive-new-key', authorizationIgnore, AuthController.receiveNewKey);

module.exports = router;