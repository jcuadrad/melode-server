exports.sanitize = function (string) {
  return string.toLowerCase().split(' ').join('-');
};

exports.sanitizeGenius = function (songName, artist) {
  return songName + ' ' + artist;
};
