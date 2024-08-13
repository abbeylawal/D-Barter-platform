const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  profile: {
    type: String,
    default: '',
  },
  nfts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'NFT',
    },
  ],
});

// module.exports = mongoose.model('User', UserSchema);
const User = mongoose.model('User', UserSchema);
module.exports = User;