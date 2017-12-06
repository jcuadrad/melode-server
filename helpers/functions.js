exports.sanitize = function (string) {
  return string.toLowerCase().split(' ').join('-');
};

exports.sanitizeGenius = function (songName, artist) {
  return songName + ' ' + artist;
};

exports.getAnnotation = function (array) {
  var annotation = [];
  array.forEach((element) => {
    if (typeof element === 'string') {
      annotation.push(element);
    } else if (typeof element === 'object') {
      annotation.push(element.children[0]);
    } else {
      console.log('What the fuck is this?');
    }
  });
  return annotation;
};
