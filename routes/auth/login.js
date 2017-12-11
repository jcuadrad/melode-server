var express = require('express');
const passport = require('passport');
var router = express.Router();
const dotenv = require('dotenv');
var urlencode = require('urlencode');

const response = require('../../helpers/response');
const User = require('../../models/User').User;

dotenv.config();

router.get('/spotify/start', (req, res) => { 
  const baseUrl = 'https://accounts.spotify.com/authorize/';
  const spotifyKey = process.env.SPOTIFY_KEY_ID;
  const redirectUri = urlencode(process.env.SPOTIFY_REDIRECT_URI);
  const scope = urlencode('user-read-email user-read-private playlist-modify-public playlist-modify-private');

  const SpotifyUrl = baseUrl + '?client_id=' + spotifyKey + '&redirect_uri=' + redirectUri + '&scope=' + scope + '&response_type=token';

  res.status(200).json({ url: SpotifyUrl });
});

router.get('/spotify/callback', (req, res, next) => {
  // somehow we are already logged in (maybe another tab)
  if (req.user) {
    return res.redirect(process.env.CALLBACK_REDIRECT);
  }
  // ask passport to authenticate the request
  // triggers the callback in passportConfig/passport.use(new SpotifyStrategy(...
  // that callback ends up with an err OR a user
  // BUT does not store the user in the session
  // req.login() below makes sure req.user is set to the user
  // 
  // finally, here, we ALWAYS redirect to the frontend APP url
  passport.authenticate('spotify', (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      res.redirect('http://localhost:4200/login?retry');
    }
    req.login(user, (err) => {
      if (err) {
        return next(err);
      }
      res.redirect(process.env.CALLBACK_REDIRECT);
    });
  })(req, res, next);
});

router.get('/logout', function (req, res, next) {
  res.send('logout');
});

router.get('/me', (req, res) => {
  if (req.isAuthenticated()) {
    return response.data(req, res, req.user);
  }
  return response.notFound(req, res);
});

module.exports = router;
