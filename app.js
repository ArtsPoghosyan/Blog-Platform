const express = require('express');
const cors = require("cors");
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const app = express();

// middlewares
app.use(cors({
  "origin": "*",
  "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
  "allowedHeaders": ["application/json"]
}));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// routers 
app.use('/', require('./routes/index'));

// error handler
app.use(function(err, req, res, next) {
  return res.status(500).json({error: process.env['MODE'] === "development" ? err || {message: "The server has encountered a situation it does not know how to handle."} : {message: "The server has encountered a situation it does not know how to handle."}});
});

module.exports = app;