var express = require('express');
const passport = require('passport');
var router = express.Router();

// Model Import
var Ode = require('../models/Ode').Ode;
var User = require('../models/User').User;

// Import Helper Functions
var helperFunction = require('../helpers/functions');
const response = require('../helpers/response');

// Import Clients
var spotify = require('../clients/spotify-client');
var musixmatch = require('../clients/musixmatch-client');
var genius = require('../clients/genius-client');

/* GET home page. */
router.post('/', function(req, res, next) {
  // Catch request information
  const userOde = req.body;

  // Sanitize information to call clients
  const stringSongName = helperFunction.sanitize(userOde.snippet.songName);
  const stringArtist = helperFunction.sanitize(userOde.snippet.artist);

  // Genius Prep to get Annotation
  const geniusQuery = helperFunction.sanitizeGenius(
    userOde.snippet.songName,
    userOde.snippet.artist
  );

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
          res.status(500).json('Fucked Up Saving!');
        } else {
          res.status(200).json({ status: 'Saved' });
        }
      });
    })
    .catch(function(err) {
      next(err);
    });
});

router.post('/random', function (req, res, next) {
  let filter = req.body.excludeIds;

  Ode.find({ _id: { $nin: filter }, isEmpty: false }, (err, odes) => {
    if (err) {
      return next(err);
    }

    let odesArray = [];
    odes.forEach(ode => {
      odesArray.push(ode);
    });

    odesArray.sort((a, b) => {
      return 0.5 - Math.random();
    });

    let size = 5;
    if (odesArray.length < size) {
      size = odesArray.length;
    }
    let newOdes = odesArray.slice(0, size);
    res.status(200).json(newOdes);
  });
});

router.get('/:userId/owned', (req, res, next) => {
  let userId = req.params.userId;
  Ode.find({ owner: userId }, (err, odes) => {
    if (err) {
      res.status(500).json(err);
    }
    res.status(200).json({ myOdes: odes });
  });
});

router.get('/:userId/liked', (req, res, next) => {
  let userId = req.params.userId;
  User.findById(userId)
    .populate('odesLiked')
    .exec((err, user) => {
      if (err) {
        return next(err);
      }
      res.json({ user: user });
    });
});

router.get('/:id', function(req, res, next) {
  let odeId = req.params.id;
  Ode.findById(odeId, (err, ode) => {
    if (err) {
      next(err);
    }
    res.json({ ode: ode });
  });
});

router.post('/autocomplete', function(req, res, next) {
  const search = req.body.artist;

  spotify
    .searchArtist(search)
    .then(result => {
      res.status(200).json(result);
    })
    .catch(err => next(err));
});

module.exports = router;
