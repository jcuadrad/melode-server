const SpotifyApi = require('node-spotify-api');
const dotenv = require('dotenv');
var SpotifyWebApi = require('spotify-web-api-node');

// credentials are optional

dotenv.config();

// API Service Key
const spotifyKeys = {
  id: process.env.SPOTIFY_KEY_ID,
  secret: process.env.SPOTIFY_KEY_SECRET,
  redirectUri: process.env.SPOTIFY_REDIRECT_URI
};

const formatResult = function (result) {
  const data = {
    name: result.name,
    image: result.album.images[1].url,
    preview: result.preview_url,
    artist: result.artists[0].name,
    uri: result.uri
  };
  return data;
};

// New Spotify Instance with Keys
const spotifyApi = new SpotifyWebApi(spotifyKeys);
const spotify = new SpotifyApi(spotifyKeys);

const search = function (stringArtist, stringSongName) {
  // Spotify Search
  return spotify.search({ type: 'track', query: `artist:${stringArtist} track:${stringSongName}`, limit: 1 })
    .then(function (spotRes) {
      if (spotRes.tracks.items.length !== 0) {
        const data = formatResult(spotRes.tracks.items[0]);
        return data;
      };
    })
    .catch((err) => {
      return err;
    });
};

const searchArtist = function (stringSongName) {
  return spotify.search({ type: 'track', query: `track:${stringSongName}`, limit: 10 })
    .then((spotRes) => {
      return spotRes.tracks.items.map(formatResult);
    })
    .catch((err) => {
      return err;
    });
};

const newPlaylist = function (user) {
  spotifyApi.setAccessToken(user.accessToken);
  spotifyApi.setRefreshToken(user.refreshToken);
  return spotifyApi.getUserPlaylists(user.spotifyId)
    .then(function (data) {
      let playlistExists = false;
      for (let ix = 0; ix < data.body.items.length; ix++) {
        if (data.body.items[ix].name === 'Melodes') {
          playlistExists = true;
        }
      }
      if (playlistExists === false) {
        return spotifyApi.createPlaylist(user.spotifyId, 'Melodes', { 'public': false })
          .then((data) => {
            return data.body.id;
          }, (err) => err);
      }
    }).catch((err) => err);
};

const addNewTrack = function (user, playlist, song) {

  spotifyApi.setAccessToken(user.accessToken);
  spotifyApi.setRefreshToken(user.refreshToken);
  spotifyApi.addTracksToPlaylist(user.spotifyId, playlist, [song])
    .then((data) => {
      return data;
    })
    .catch((err) => err);
};

module.exports = {
  search: search,
  searchArtist: searchArtist,
  createPlaylist: newPlaylist,
  addTrack: addNewTrack
};
