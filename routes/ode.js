var express = require('express');
var router = express.Router();

// Model Import
var Ode = require('../models/Ode').Ode;

// Import Helper Functions
var helperFunction = require('../helpers/functions');

// Import Clients
var spotify = require('../clients/spotify-client');
var musixmatch = require('../clients/musixmatch-client');
var genius = require('../clients/genius-client');

/* GET home page. */
router.post('/', function (req, res, next) {
  // Catch request information
  const userOde = req.body;

  // Sanitize information to call clients
  const stringSongName = helperFunction.sanitize(userOde.songName);
  const stringArtist = helperFunction.sanitize(userOde.artist);

  // Genius Prep to get Annotation
  const geniusQuery = helperFunction.sanitizeGenius(userOde.songName, userOde.artist);

  // Query API's
  const spotifyPromise = spotify.search(stringArtist, stringSongName);
  const musixMatchPromise = musixmatch.search(stringArtist, stringSongName);
  const geniusPromise = genius.search(geniusQuery);

  // Resolve Queries
  Promise.all([spotifyPromise, musixMatchPromise, geniusPromise])
    .then(results => {
      const spotifyRes = results[0];
      const musixMatchRes = results[1];
      const geniusRes = results[2];
      // Create new Ode Object
      var newOde = new Ode({
        snippet: userOde.snippet,
        songName: userOde.songName,
        artist: userOde.artist,
        spotify: spotifyRes,
        musixmatch: musixMatchRes,
        genius: geniusRes,
        isEmpty: !geniusRes && !musixMatchRes && !spotifyRes // @todo declare in schema
      });

      // Save new Ode
      newOde.save(error => {
        if (error) {
          console.log('Fucked Up Saving!');
        } else {
          res.status(200).json({ status: 'Saved' });
        }
      });
    })
    .catch(function (err) {
      next(err);
    });
});

router.get('/random', function (req, res, next) {
  res.send('random ode');
});

router.get('/:id', function (req, res, next) {
  res.send('this specific ode');
});

router.post('/by-id', function (req, res, next) {
  res.send('the users odes');
});

module.exports = router;
