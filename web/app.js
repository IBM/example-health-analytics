/**
 * Main app.js file for web app of Summit Health Analytics
 */

var createError = require('http-errors');
var express = require('express');
var bodyParser = require('body-parser');
var logger = require('morgan');

var app = express();

var indexRouter = require('./routes/index');

app.use(logger('dev'));

app.use(express.static('./public')); // load UI from public folder
app.use(bodyParser.json())

app.use('/data', indexRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
});

module.exports = app;
