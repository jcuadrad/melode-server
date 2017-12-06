const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const odeSchema = new Schema({
  snippet: String,
  songName: String,
  artist: String,
  spotify: {
    name: String,
    image: String,
    preview: String,
    artist: String,
    uri: String
  },
  musixmatch: {
    lyrics: [String],
    fullLink: String
  },
  genius: {
    annotation: []
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  isEmpty: Boolean
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

const Ode = mongoose.model('Ode', odeSchema);

module.exports = {Ode: Ode};
