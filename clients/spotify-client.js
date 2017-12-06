var SpotifyApi = require('node-spotify-api');

// API Service Key
var keys = require('../keys');

// New Spotify Instance with Keys
var spotify = new SpotifyApi(keys.spotifyKeys);

const search = function (stringArtist, stringSongName) {
  // Spotify Search
  return spotify.search({ type: 'track', query: `artist:${stringArtist} track:${stringSongName}`, limit: 1 })
    .then(function (spotRes) {
      console.log('Going to Spotify');
      if (spotRes.tracks.items.length !== 0) {
        var name = spotRes.tracks.items[0].name;
        var preview = spotRes.tracks.items[0].preview_url;
        var image = spotRes.tracks.items[0].album.images[1].url;
        var artistName = spotRes.tracks.items[0].artists[0].name;
        var uri = spotRes.tracks.items[0].uri;
        var data = {
          name: name,
          image: image,
          preview: preview,
          artist: artistName,
          uri: uri
        };
        console.log('SPOTIFY RESULT:', data);
        return data;
      } else {
        // var dataEmpty = {};
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
