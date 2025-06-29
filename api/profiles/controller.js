const Profile = require('./model');

exports.getAllProfiles = async (req, res) => {
  const filter = {};
  if (req.query.skill) filter.skills = req.query.skill;
  if (req.query.localisation) filter['information.localisation'] = req.query.localisation;

  const profiles = await Profile.find(filter).populate('friends');
  res.json(profiles);
};

exports.createProfile = async (req, res) => {
  const { name, email } = req.body;
  const profile = new Profile({ name, email });
  await profile.save();
  res.status(201).json(profile);
};

// autres méthodes similaires : update, delete, addExperience, addSkill, etc.
