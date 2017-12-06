var axios = require('axios');

// API Service Key
var keys = require('../keys');

// // API Service Info
const musixmatchApiKey = keys.MUSIXMATH_API_KEY;
const musixmatchBaseUrl = 'https://api.musixmatch.com/ws/1.1/';

function search (stringArtist, stringSongName) {
  // Musixmatch Lyrics Search
  return axios.get(musixmatchBaseUrl + 'matcher.lyrics.get?q_track=' + stringSongName + '&q_artist=' + stringArtist + '&apikey=' + musixmatchApiKey)
    .then(function (mxmRes) {
      if (mxmRes.data.message.body.length !== 0) {
        var lyrics = mxmRes.data.message.body.lyrics.lyrics_body.split('\n');
        var fullLink = mxmRes.data.message.body.lyrics.backlink_url;
        var data = {
          lyrics: lyrics,
          fullLink: fullLink
        };
        console.log('MUSIXMATCH RESULT:', data);
        return data;
      } else {
        // var dataEmpty = {};
        console.log('Nothing in Musixmatch!');
        // return dataEmpty;
      }
    })
    .catch((err) => {
      console.log(err);
    }); // @todo handle this properly
}

module.exports = {
  search
};
