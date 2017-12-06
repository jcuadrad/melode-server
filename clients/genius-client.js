var GeniusApi = require('genius-api');

// API Service Key
var keys = require('../keys');

// Import Helper Functions
var helperFunction = require('../helpers/functions');

// New Genius Instance with Keys
var genius = new GeniusApi(keys.GENIUS_CLIENT_ACCESS_TOKEN);

function search (geniusQuery) {
  // Genius Song Search
  return genius.search(`${geniusQuery}`)
    .then(function (geniusSearchRes) {
      if (geniusSearchRes.hits.length !== 0) {
        let geniusSongId = geniusSearchRes.hits[0].result.id;
        // Genius Get Annotation
        return genius.song(geniusSongId).then((geniusRes) => {
          var annotation = helperFunction.getAnnotation(geniusRes.song.description.dom.children[0].children);
          var data = {
            annotation: annotation
          };
          console.log('GENIUS RESULT:', data);
          return data;
        });
      } else {
        // var dataEmpty = {};
        console.log('Nothing in Genius!');
        // return dataEmpty;
      }
    }
    );
}

module.exports = {
  search
};
