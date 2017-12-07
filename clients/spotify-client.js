const SpotifyApi = require('node-spotify-api');
const dotenv = require('dotenv');

dotenv.config();

// API Service Key
const spotifyKeys = {
  id: process.env.SPOTIFY_KEY_ID,
  secret: process.env.SPOTIFY_KEY_SECRET,
  redirectUri: process.env.SPOTIFY_REDIRECT_URI
};

// New Spotify Instance with Keys
const spotify = new SpotifyApi(spotifyKeys);

const search = function (stringArtist, stringSongName) {
  // Spotify Search
  return spotify.search({ type: 'track', query: `artist:${stringArtist} track:${stringSongName}`, limit: 1 })
    .then(function (spotRes) {
      console.log('Going to Spotify');
      if (spotRes.tracks.items.length !== 0) {
        const name = spotRes.tracks.items[0].name;
        const preview = spotRes.tracks.items[0].preview_url;
        const image = spotRes.tracks.items[0].album.images[1].url;
        const artistName = spotRes.tracks.items[0].artists[0].name;
        const uri = spotRes.tracks.items[0].uri;
        const data = {
          name: name,
          image: image,
          preview: preview,
          artist: artistName,
          uri: uri
        };
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

module.exports = {
  search
};
