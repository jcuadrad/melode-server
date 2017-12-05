var express = require('express');
var SpotifyApi = require('node-spotify-api');
var axios = require('axios');
var GeniusApi = require('genius-api');
var router = express.Router();

// Import Api Services Keys
var keys = require('../keys');

// Import Helper Functions
var helperFunction = require('../helpers/functions');

// Validate API services with Keys
var genius = new GeniusApi(keys.GENIUS_CLIENT_ACCESS_TOKEN);
var spotify = new SpotifyApi(keys.spotifyKeys);

/* GET home page. */
router.post('/', function (req, res, next) {
  // Catch request information
  const userOde = req.body;

  res.json('OK!');

  // Musixmatch Prep to get Lyrics
  const musixmatchBaseUrl = 'https://api.musixmatch.com/ws/1.1/';
  const musixmatchApiKey = keys.MUSIXMATH_API_KEY;
  const stringSongName = helperFunction.mxmStringify(userOde.songName);
  const stringArtist = helperFunction.mxmStringify(userOde.artist);

  // Genius Prep to get Annotation
  const geniusQuery = userOde.songName + ' ' + userOde.artist;

  // Spotify Search
  spotify.search({ type: 'track', query: `artist:${stringArtist} track:${stringSongName}`, limit: 1 })
    .then(function (spotRes) {
      console.log('Going to Spotify');
      if (spotRes.tracks.items.length !== 0) {
        var name = spotRes.tracks.items[0].name;
        var preview = spotRes.tracks.items[0].preview_url;
        var image = spotRes.tracks.items[0].album.images[1].url;
        var artistName = spotRes.tracks.items[0].artists[0].name;
        var uri = spotRes.tracks.items[0].uri;
        console.log(name, preview);
      } else {
        console.log('Nothing in Spotify');
      }
      // Musixmatch Lyrics Search
      axios.get(musixmatchBaseUrl + 'matcher.lyrics.get?q_track=' + stringSongName + '&q_artist=' + stringArtist + '&apikey=' + musixmatchApiKey)
        .then(function (mxmRes) {
          if (mxmRes.data.message.body.length !== 0) {
            var lyrics = mxmRes.data.message.body.lyrics.lyrics_body.split('\n');
            var fullLink = mxmRes.data.message.body.lyrics.backlink_url;
          } else {
            console.log('Nothing in Musixmatch!');
          }
          // Genius Song Search
          genius.search(`${geniusQuery}`).then(function (geniusSearchRes) {
            if (geniusSearchRes.hits.length !== 0) {
              let geniusSongId = geniusSearchRes.hits[0].result.id;
              // Genius Get Annotation
              genius.song(geniusSongId).then((geniusRes) => {
                var annotation = helperFunction.getAnnotation(geniusRes.song.description.dom.children[0].children);
                var newOde = {
                  snippet: userOde.snippet,
                  songName: userOde.songName,
                  artist: userOde.artist,
                  spotify: {
                    name: name,
                    image: image,
                    preview: preview,
                    artist: artistName,
                    uri: uri
                  },
                  musixmatch: {
                    lyrics: lyrics,
                    fullLink: fullLink
                  },
                  genius: {
                    annotation: annotation
                  }
                };
                newOde.save(error => {
                  if (error) {
                    console.log('Fucked Up Saving!');
                  } else {
                    res.json({ status: 'Saved' });
                  }
                });
              });
            } else {
              var newOde = {
                snippet: userOde.snippet,
                songName: userOde.songName,
                artist: userOde.artist,
                spotify: {
                  name: '',
                  image: '',
                  preview: '',
                  artist: '',
                  uri: ''
                },
                musixmatch: {
                  lyrics: [],
                  fullLink: ''
                },
                genius: {
                  annotation: []
                }
              };
              newOde.save(error => {
                if (error) {
                  console.log('Fucked up saving empy');
                } else {
                  res.json({ status: 'Saved Empty' });
                }
              });
            }
          });
        });
    })
    .catch(function (err) {
      console.log(err);
      throw err;
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
