const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

// // API Service Info
const musixmatchApiKey = process.env.MUSIXMATCH_API_KEY;
const musixmatchBaseUrl = 'https://api.musixmatch.com/ws/1.1/';

function search (stringArtist, stringSongName) {
  // Musixmatch Lyrics Search
  return axios.get(musixmatchBaseUrl + 'matcher.lyrics.get?q_track=' + stringSongName + '&q_artist=' + stringArtist + '&apikey=' + musixmatchApiKey)
    .then(function (mxmRes) {
      if (mxmRes.data.message.body.length !== 0) {
        const lyrics = mxmRes.data.message.body.lyrics.lyrics_body.split('\n');
        const fullLink = mxmRes.data.message.body.lyrics.backlink_url;
        const data = {
          lyrics: lyrics,
          fullLink: fullLink
        };
        console.log('MUSIXMATCH RESULT:', data);
        return data;
      } else {
        // const dataEmpty = {};
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
