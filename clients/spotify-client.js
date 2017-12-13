const SpotifyApi = require('node-spotify-api');
const dotenv = require('dotenv');

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
const spotify = new SpotifyApi(spotifyKeys);

const search = function (stringArtist, stringSongName) {
  // Spotify Search
  return spotify.search({ type: 'track', query: `artist:${stringArtist} track:${stringSongName}`, limit: 1 })
    .then(function (spotRes) {
      console.log('Going to Spotify');
      if (spotRes.tracks.items.length !== 0) {
        const data = formatResult(spotRes.tracks.items[0]);
        console.log('SPOTIFY RESULT:', data);
        return data;
      } else {
        // const dataEmpty = {};
        console.log('Nothing in Spotify');
        // return dataEmpty;
      }
    }
    )
    .catch((err) => {
      console.log(err);
    }); // @todo handle this properly
};

const searchArtist = function (stringSongName) {
  return spotify.search({ type: 'track', query: `track:${stringSongName}`, limit: 10 })
    .then((spotRes) => {
      return spotRes.tracks.items.map(formatResult);
    })
    .catch((err) => {
      console.log(err);
    });
};

module.exports = {
  search: search,
  searchArtist: searchArtist
};
