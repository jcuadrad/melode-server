const express = require('express');
const passport = require('passport');
const router = express.Router();
const dotenv = require('dotenv');
const urlencode = require('urlencode');

const response = require('../../helpers/response');
const User = require('../../models/User').User;
const Ode = require('../../models/Ode').Ode;
const spotify = require('../../clients/spotify-client');

dotenv.config();

router.get('/spotify/start', (req, res) => { 
  const baseUrl = 'https://accounts.spotify.com/authorize/';
  const spotifyKey = process.env.SPOTIFY_KEY_ID;
  const redirectUri = urlencode(process.env.SPOTIFY_REDIRECT_URI);
  const scope = urlencode('user-read-email user-read-private playlist-read-private playlist-modify-public playlist-modify-private');

  const SpotifyUrl = baseUrl + '?client_id=' + spotifyKey + '&redirect_uri=' + redirectUri + '&scope=' + scope + '&show_dialog=true&response_type=token';

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
  passport.authenticate('spotify', {scope: ['user-read-email', 'user-read-private', 'playlist-modify-public', 'playlist-modify-private', 'playlist-read-private']}, (err, user, info) => {
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

router.post('/:id/ode', (req, res, next) => {
  let userId = { _id: req.params.id };
  let odeId = { $push: { odesLiked: req.body.id }
  };
  User.findById(req.params.id, (err, user) => {
    if (err) {
      response.notFound(req, res);
    }
    if (!user) {
      res.status(400).send({ message: 'User not found' });
    } else {
      if (user.odesLiked.indexOf(req.body.id) === -1) {
        Ode.findById(req.body.id, (err, ode) => {
          if (err) {
            return next(err);
          }
          spotify.addTrack(user, user.melodePlaylistId, ode.spotify.uri);
          let odeOwner = ode.owner.toString();
          let useridtest = user._id.toString();
          if (odeOwner !== useridtest) {
            User.findOneAndUpdate(userId, odeId, (err, success) => {
              if (err) {
                return next(err);
              }
              response.ok(req, res);
            });
          } else {
            res.status(200).json({ message: 'Its mine' });
          }
        });
      } else {
        res.status(200).json({ message: 'Already there' });
      }
    }
  });
});

module.exports = router;
