const Profile = require('./model');

/*--------------------------------------------------
  Helpers
--------------------------------------------------*/
const notFound = (res) => res.status(404).json({ message: 'Profil introuvable' });

/*--------------------------------------------------
  CRUD : Profils
--------------------------------------------------*/

// GET /profiles
exports.getAllProfiles = async (req, res) => {
  try {
    const filter = { deleted: { $ne: true } };

    // filtres dynamiques
    if (req.query.skill) filter.skills = req.query.skill;
    if (req.query.localisation) filter['information.localisation'] = req.query.localisation;

    const profiles = await Profile.find(filter).populate('friends');
    res.json(profiles);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /profiles/:id
exports.getProfileById = async (req, res) => {
  try {
    const profile = await Profile.findOne({ _id: req.params.id, deleted: { $ne: true } }).populate('friends');
    if (!profile) return notFound(res);
    res.json(profile);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /profiles
exports.createProfile = async (req, res) => {
  try {
    const { name, email } = req.body;
    const profile = new Profile({ name, email });
    await profile.save();
    res.status(201).json(profile);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// PUT /profiles/:id
exports.updateProfile = async (req, res) => {
  try {
    const { name, email } = req.body;
    const profile = await Profile.findOneAndUpdate(
      { _id: req.params.id, deleted: { $ne: true } },
      { name, email },
      { new: true, runValidators: true }
    );
    if (!profile) return notFound(res);
    res.json(profile);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// DELETE (soft) /profiles/:id
exports.softDeleteProfile = async (req, res) => {
  try {
    const profile = await Profile.findOneAndUpdate(
      { _id: req.params.id, deleted: { $ne: true } },
      { deleted: true, deletedAt: new Date() },
      { new: true }
    );
    if (!profile) return notFound(res);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/*--------------------------------------------------
  Expériences
--------------------------------------------------*/

// POST /profiles/:id/experience
exports.addExperience = async (req, res) => {
  try {
    const profile = await Profile.findById(req.params.id);
    if (!profile || profile.deleted) return notFound(res);

    profile.experience.push(req.body);
    await profile.save();
    res.json(profile);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// DELETE /profiles/:id/experience/:exp
exports.deleteExperience = async (req, res) => {
  try {
    const profile = await Profile.findById(req.params.id);
    if (!profile || profile.deleted) return notFound(res);

    profile.experience.id(req.params.exp)?.remove();
    await profile.save();
    res.json(profile);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

/*--------------------------------------------------
  Compétences
--------------------------------------------------*/

// POST /profiles/:id/skills
exports.addSkill = async (req, res) => {
  try {
    const profile = await Profile.findById(req.params.id);
    if (!profile || profile.deleted) return notFound(res);

    profile.skills.push(req.body.skill);
    await profile.save();
    res.json(profile);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// DELETE /profiles/:id/skills/:skill
exports.deleteSkill = async (req, res) => {
  try {
    const profile = await Profile.findById(req.params.id);
    if (!profile || profile.deleted) return notFound(res);

    profile.skills = profile.skills.filter((s) => s !== req.params.skill);
    await profile.save();
    res.json(profile);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

/*--------------------------------------------------
  Informations
--------------------------------------------------*/

// PUT /profiles/:id/information
exports.updateInformation = async (req, res) => {
  try {
    const profile = await Profile.findOneAndUpdate(
      { _id: req.params.id, deleted: { $ne: true } },
      { information: req.body },
      { new: true }
    );
    if (!profile) return notFound(res);
    res.json(profile);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

/*--------------------------------------------------
  Amis
--------------------------------------------------*/

// POST /profiles/:id/friends/:friendId
exports.addFriend = async (req, res) => {
  try {
    const profile = await Profile.findById(req.params.id);
    if (!profile || profile.deleted) return notFound(res);

    if (!profile.friends.includes(req.params.friendId)) profile.friends.push(req.params.friendId);
    await profile.save();
    res.json(profile);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// DELETE /profiles/:id/friends/:friendId
exports.removeFriend = async (req, res) => {
  try {
    const profile = await Profile.findById(req.params.id);
    if (!profile || profile.deleted) return notFound(res);

    profile.friends = profile.friends.filter(
      (friend) => friend.toString() !== req.params.friendId
    );
    await profile.save();
    res.json(profile);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
