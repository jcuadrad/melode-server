var express = require('express');
const passport = require('passport');
var router = express.Router();
const dotenv = require('dotenv');
var urlencode = require('urlencode');

const User = require('../../models/User').User;

dotenv.config();

/* GET home page. */
// router.get('/spotify/start', passport.authenticate('spotify', 
//   {scope: ['user-read-email', 'user-read-private', 'playlist-modify-public', 'playlist-modify-private'], showDialog: true}),
// function (req, res) {
//   res.json({redirectUrl: something })
// });

router.get('/spotify/start', (req, res) => { 
  const baseUrl = 'https://accounts.spotify.com/authorize/';
  const spotifyKey = process.env.SPOTIFY_KEY_ID;
  const redirectUri = urlencode(process.env.SPOTIFY_REDIRECT_URI);
  const scope = urlencode('user-read-email user-read-private playlist-modify-public playlist-modify-private');

  const SpotifyUrl = baseUrl + '?client_id=' + spotifyKey + '&redirect_uri=' + redirectUri + '&scope=' + scope + '&response_type=token';
  
  // url = baseUrl + ? + params.map(item => urlencode(item)).join('&)'

  // const SpotifyUrl = 'https://accounts.spotify.com/authorize/?client_id=6bbca00628304a9ab4c67be40eda0dd0&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fauth%2Fspotify%2Fcallback%2F&scope=user-read-private%20user-read-email&response_type=token';
 
  res.status(200).json({ url: SpotifyUrl });
});

router.get('/spotify/callback', passport.authenticate('spotify', { failureRedirect: 'http://localhost:4200/login?retry' }), (req, res) => {
  console.log(req.user.id);
  // res.append('user', req.user.id);
  res.redirect(process.env.CALLBACK_REDIRECT + '?id=' + req.user.id + '&a=c');
});

router.get('/logout', function (req, res, next) {
  res.send('logout');
});

router.get('/me/:id', (req, res, next) => {
  let userId = req.params;
  console.log(userId);
  User.findById(userId.id, (err, user) => {
    if (err) {
      next(err);
    }
    res.json({ user: user });
  });
});

module.exports = router;
