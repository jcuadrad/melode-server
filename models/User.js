const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: String,
  username: String,
  spotifyId: String,
  photos: [String],
  emails: [{}],
  odesLiked: [{
    type: Schema.Types.ObjectId,
    ref: 'Ode'
  }],
  odesCreated: [{
    type: Schema.Types.ObjectId,
    ref: 'Ode'
  }]
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

const User = mongoose.model('User', userSchema);

module.exports = {User: User};
