const mongoose = require('mongoose');

const experienceSchema = new mongoose.Schema({
  titre: String,
  entreprise: String,
  dates: String,
  description: String,
}, { _id: true });

const profileSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  experience: [experienceSchema],
  skills: [String],
  information: {
    bio: String,
    localisation: String,
    site: String,
  },
  friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Profile' }],
});

module.exports = mongoose.model('Profile', profileSchema);
