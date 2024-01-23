const express = require('express');
const authRouter = require("./auth"); 
const userRouter = require("./user"); 
const blogRouter = require("./blog"); 
const router = express.Router();

// middlewares
router.use('/auth', authRouter);
router.use('/user', userRouter);
router.use('/blog', blogRouter);

module.exports = router;
