const express = require('express');
const cors = require('cors');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
const MongoStore = require('connect-mongo')(session);

const passportConfiguration = require('./helpers/passportConfig');

const ode = require('./routes/ode');
const user = require('./routes/user');
const auth = require('./routes/auth/login');

const dotenv = require('dotenv');

const app = express();

dotenv.config();

passportConfiguration();
app.use(passport.initialize());
app.use(passport.session());

// Connect mongoose database
mongoose.Promise = Promise;
mongoose.connect(process.env.MONGODB_URI, {
  keepAlive: true,
  reconnectTries: Number.MAX_VALUE,
  useMongoClient: true
});

app.use(cors({
  credentials: true,
  origin: [process.env.CLIENT_URL]
}
));
// SESSION
app.use(session({
  store: new MongoStore({
    mongooseConnection: mongoose.connection,
    ttl: 24 * 60 * 60 // 1 day
  }),
  secret: 'melode',
  resave: true,
  saveUninitialized: true,
  cookie: {
    maxAge: 24 * 60 * 60 * 10000
  }
}));

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/ode', ode);
app.use('/auth', auth);
app.use('/user', user);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  res.status(404);
  res.json({error: 'error.not-found'});
});

// error handler
app.use(function (err, req, res, next) {
  if (!res.headersSent) {
    res.status(500);
    res.json({error: 'error.unexpected'});
  }
});

module.exports = app;
