/*##############################################################################
# Copyright 2019 IBM Corp. All Rights Reserved.
#
#  Licensed under the Apache License, Version 2.0 (the "License");
#  you may not use this file except in compliance with the License.
#  You may obtain a copy of the License at
#
#       http://www.apache.org/licenses/LICENSE-2.0
#
#   Unless required by applicable law or agreed to in writing, software
#   distributed under the License is distributed on an "AS IS" BASIS,
#   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
#   See the License for the specific language governing permissions and
#   limitations under the License.
##############################################################################*/
/**
 * Main app.js file for data service of Example Health Analytics
 */

var createError = require('http-errors');
var express = require('express');
var bodyParser = require('body-parser');
var logger = require('morgan');
var swaggerUi = require('swagger-ui-express');
var YAML = require('yamljs');
var swaggerDocument = YAML.load('swagger.yaml');
swaggerDocument.host = process.env.HOST_IP || "localhost:3000";
var scheme = process.env.SCHEME || "http";
swaggerDocument.schemes = [scheme];

var updateRouter = require('./routes/update');
var populationRouter = require('./routes/population');
var citiesRouter = require('./routes/cities');
var allergiesRouter = require('./routes/allergies');
var generateRouter = require('./routes/generate');

var app = express();
var api = "/api/v1";

app.use(logger('dev'));
app.use(bodyParser.json({limit: '25mb'}));
app.use(bodyParser.urlencoded({limit: '25mb', extended: true}));

app.use(api + '/update', updateRouter);
app.use(api + '/population', populationRouter);
app.use(api + '/cities', citiesRouter);
app.use(api + '/allergies', allergiesRouter);
app.use(api + '/generate', generateRouter);

app.use('/', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

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
