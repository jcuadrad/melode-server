var express = require('express');
const passport = require('passport');
var router = express.Router();

/* GET home page. */
// router.get('/spotify/start', passport.authenticate('spotify', 
//   {scope: ['user-read-email', 'user-read-private', 'playlist-modify-public', 'playlist-modify-private'], showDialog: true}),
// function (req, res) {
//   res.json({redirectUrl: something })
// });

router.get('/spotify/start', (req, res) => {    
  // const params = [];

  // url = baseUrl + ? + params.map(item => urlencode(item)).join('&)'

  const SpotifyUrl = 'https://accounts.spotify.com/authorize/?client_id=6bbca00628304a9ab4c67be40eda0dd0&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fauth%2Fspotify%2Fcallback%2F&scope=user-read-private%20user-read-email&response_type=token';
 
  res.status(200).json({ url: SpotifyUrl });
});

router.get('/spotify/callback', passport.authenticate('spotify', { failureRedirect: 'http://localhost:4200/login?retry' }), (req, res) => {
  res.redirect('http://localhost:4200/share');
});

router.get('/logout', function (req, res, next) {
  res.send('logout');
});

module.exports = router;
