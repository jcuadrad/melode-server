const express = require('express');
const cors = require('cors');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const ode = require('./routes/ode');
const user = require('./routes/user');
const auth = require('./routes/auth/login');

// Connect mongoose database
mongoose.Promise = Promise;
mongoose.connect('mongodb://localhost/melode', {
  keepAlive: true,
  reconnectTries: Number.MAX_VALUE,
  useMongoClient: true
});

const app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/ode', ode);
app.use('/auth', auth);
app.use('/user', user);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  res.status(404);
  res.json({error: 'error.not-found'});
});

// error handler
app.use(function(err, req, res, next) {
  if (!res.headersSent) {
    res.status(500);
    res.json({errror: 'error.unexpected'});
  }
});

module.exports = app;
