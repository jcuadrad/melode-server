var express = require('express');
const passport = require('passport');
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
  const stringSongName = helperFunction.sanitize(userOde.snippet.songName);
  const stringArtist = helperFunction.sanitize(userOde.snippet.artist);

  // Genius Prep to get Annotation
  const geniusQuery = helperFunction.sanitizeGenius(userOde.snippet.songName, userOde.snippet.artist);

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
        owner: userOde.ownerId,
        snippet: userOde.snippet.snippet,
        songName: userOde.snippet.songName,
        artist: userOde.snippet.artist,
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

router.post('/random', function (req, res, next) {
  let filter = req.body;

  Ode.random(10, (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).json(err);
    } else {
      let newResults = filter.excludeIds.filter(val => !result.includes(val));
      console.log(newResults);
      res.status(200).json(result);
    }
  });
});

router.get('/:id', function (req, res, next) {
  let odeId = req.params.id;
  Ode.findById(odeId, (err, ode) => {
    if (err) {
      next(err);
    }
    res.json({ ode: ode });
  });
});

router.post('/by-id', function (req, res, next) {
  res.send('the users odes');
});

module.exports = router;
