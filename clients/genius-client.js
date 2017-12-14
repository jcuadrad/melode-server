const GeniusApi = require('genius-api');
const dotenv = require('dotenv');

dotenv.config();

// New Genius Instance with Keys
const genius = new GeniusApi(process.env.GENIUS_CLIENT_ACCESS_TOKEN);

function search (geniusQuery) {
  // Genius Song Search
  return genius.search(`${geniusQuery}`)
    .then(function (geniusSearchRes) {
      if (geniusSearchRes.hits.length !== 0) {
        let geniusSongId = geniusSearchRes.hits[0].result.id;
        // Genius Get Annotation
        return genius.song(geniusSongId, {text_format: 'plain'}).then((geniusRes) => {
          const annotation = geniusRes.song.description.plain;
          const data = {
            annotation: annotation
          };
          console.log('GENIUS RESULT:', data);
          return data;
        });
      } else {
        // const dataEmpty = {};
        console.log('Nothing in Genius!');
        // return dataEmpty;
      }
    }
    );
}

module.exports = {
  search
};
