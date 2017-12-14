const passport = require('passport');
const User = require('../models/User').User;

const SpotifyStrategy = require('passport-spotify').Strategy;
const spotify = require('../clients/spotify-client');

const options = {
  clientID: process.env.SPOTIFY_KEY_ID,
  clientSecret: process.env.SPOTIFY_KEY_SECRET,
  callbackURL: process.env.SPOTIFY_REDIRECT_URI
};

function passportConfig () {

  passport.serializeUser(function (user, done) {
    done(null, user);
  });

  passport.deserializeUser(function (obj, done) {
    obj = obj ? new User(obj) : null;
    done(null, obj);
  });

  passport.use(new SpotifyStrategy(options, function (accessToken, refreshToken, profile, done) {
    User.findOne({
      spotifyId: profile.id
    }, (err, user) => {
      if (err) {
        return done(err);
      }
      if (user) {
        return done(null, user);
      }

      const newUser = new User({
        spotifyId: profile.id,
        provider: profile.provider,
        username: profile.username,
        name: profile.displayName,
        photos: profile.photos,
        emails: profile.emails,
        melodePlaylistId: '',
        accessToken: accessToken,
        refreshToken: refreshToken
      });

      spotify.createPlaylist(newUser)
        .then(playlistId => {
          newUser.melodePlaylistId = playlistId;
          newUser.save(err => {
            if (err) {
              return done(err);
            }
            done(null, newUser);
          });
        });
    });
  }));
};

module.exports = passportConfig;
