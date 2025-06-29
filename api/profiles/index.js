const express = require('express');
const router = express.Router();
const controller = require('./controller');

router.get('/', controller.getAllProfiles);
router.post('/', controller.createProfile);
router.put('/:id', controller.updateProfile);
router.delete('/:id', controller.deleteProfile);

router.post('/:id/experience', controller.addExperience);
router.delete('/:id/experience/:exp', controller.deleteExperience);

router.post('/:id/skills', controller.addSkill);
router.delete('/:id/skills/:skill', controller.deleteSkill);

router.put('/:id/information', controller.updateInformation);

router.post('/:id/friends/:friendId', controller.addFriend);
router.delete('/:id/friends/:friendId', controller.removeFriend);

module.exports = router;
