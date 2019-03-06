const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');
// const keys = require('../../config/keys');

//Load Validation
const validateProfileInput = require('../../validation/profile');
const validateExperienceInput = require('../../validation/experience');
const validateEducationInput = require('../../validation/education');

// Load Profile Model
const Profile = require('../../models/Profile');
// Load User Model
const User = require('../../models/User');

// @route			GET api/profile/test
// @description 	Tests the "profile" route
// @access			Public
router.get('/test', (req, res) => res.json({msg: "The \"Profile\" route works as expected."}));

// @route			GET api/profile
// @description 	Get the current user's profile page
// @access			Private
router.get('/', passport.authenticate('jwt', {session: false}), (req, res) => {
	const errors = {};
	Profile.findOne({user: req.user.id})
		.populate('user', ['name', 'avatar'])
		.then(profile => {
			if(!profile) {
				errors.noprofile = "Sorry, this profile does not exist";
				return res.status(404).json(errors);
			}
			res.json(profile);
		})
		.catch(err => res.status(404).json(err));
});

// @route			GET api/profile/all
// @description 	Get all profiles
// @access			Public
router.get('/all', (req, res) => {
	const errors = {};
	Profile.find()
		.populate('user', ['name', 'avatar'])
		.then(profiles => {
			if(!profiles) {
				errors.noprofile = "Oh no! There's nobody on the network! It's empty!";
				return res.status(404).json(errors);
			}

			res.json(profiles);
		})
		.catch(err => res.status(404).json("Oh no! There's nobody on the network! It's empty!"));
});

// @route			GET api/profile/handle/:handle
// @description 	Get the profile by handle
// @access			Public
router.get('/handle/:handle', (req, res) => {
	const errors = {};
	Profile.findOne({handle:req.params.handle})
		.populate('user', ['name', 'avatar'])
		.then(profile => {
			if(!profile) {
				errors.noprofile = "Sorry. This profile does not exist.";
				res.status(404).json(errors);
			}

			res.json(profile);
		})
		.catch(err => res.status(404).json(err));
});

// @route			GET api/profile/user/:user_id
// @description 	Get the profile by User ID
// @access			Public
router.get('/user/:user_id', (req, res) => {
	const errors = {};
	Profile.findOne({user:req.params.user_id})
		.populate('user', ['name', 'avatar'])
		.then(profile => {
			if(!profile) {
				errors.noprofile = "Sorry. This user does not exist.";
				res.status(404).json(errors);
			}

			res.json(profile);
		})
		.catch(err => res.status(404).json({profile: "This profile does not exist"}));
});

// @route			POST api/profile
// @description 	Create a new user profile or edit an existing profile
// @access			Private
router.post('/', passport.authenticate('jwt', {session: false}), (req, res) => {
	/**
	 * The following "const" and "if(!isValid) ... etc etc",
	 * we need to do this at the beginning of anything that
	 * we're trying to validate.
	 */
	const {errors, isValid} = validateProfileInput(req.body);

	// Check Validation
	if(!isValid) {
		// Return any errors with a Status 400 response
		return res.status(400).json(errors);
	}

	// Get Fields
	const profileFields = {};
	profileFields.user = req.user.id;
	if(req.body.handle) profileFields.handle = req.body.handle;
	if(req.body.company) profileFields.company = req.body.company;
	if(req.body.website) profileFields.website = req.body.website;
	if(req.body.location) profileFields.location = req.body.location;
	if(req.body.bio) profileFields.bio = req.body.bio;
	if(req.body.status) profileFields.status = req.body.status;
	if(req.body.githubUserName) profileFields.githubUserName = req.body.githubUserName;

	// Skills: we need to split this into an array
	if(typeof req.body.skills !== 'undefined') {
		profileFields.skills = req.body.skills.split(',');
	}

	// Social
	profileFields.social = {};
	if(req.body.youtube) profileFields.social.youtube = req.body.social.youtube;
	if(req.body.twitter) profileFields.social.twitter = req.body.twitter;
	if(req.body.gab) profileFields.social.gab = req.body.gab;
	if(req.body.linkedin) profileFields.social.linkedin = req.body.linkedin;
	if(req.body.instagram) profileFields.social.instagram = req.body.instagram;

	Profile.findOne({user: req.user.id})
		.then(profile => {
			if(profile) {
				// If there's a profile, that means this is an update
				Profile.findOneAndUpdate(
					{user: req.user.id},
					{$set: profileFields},
					{new: true}
				).then(profile => res.json(profile));
			} else {
				// If there isn't, then we need to create a new one
				// Check to see if the handle already exists
				Profile.findOne({handle: profileFields.handle}).then(profile => {
					if(profile) {
						errors.handle = "This account is already registered.";
						res.status(400).json(errors);
					}

					// If that handle doesn't exist, then we can save this one
					new Profile(profileFields).save().then(profile => res.json(profile));
				})
			}
		})

	/*
	if(req.body.#) profileFields.social.# = req.body.#;
	if(req.body.#) profileFields.# = req.body.#;
	*/

});

// @route			POST api/profile/experience
// @description 	Add experience to a profile
// @access			Private
router.post('/experience', passport.authenticate('jwt', {session: false}), (req, res) => {
	const {errors, isValid} = validateExperienceInput(req.body);

	// Check Validation
	if(!isValid) {
		// Return any errors with a Status 400 response
		return res.status(400).json(errors);
	}

	Profile.findOne({user: req.user.id})
		.then(profile => {
			const newExp = {
				title: req.body.title,
				company: req.body.company,
				location: req.body.location,
				from: req.body.from,
				to: req.body.to,
				current: req.body.current,
				description: req.body.description
			}

			// Add to the experience array
			profile.experience.unshift(newExp); //	"unshift" is the opposite of "push", i.e.,
												//	instead of adding a new piece of information
												//	to the end of an array, it adds it to the
												//	beginning and moves everything over one space

			profile.save()
				.then(profile => res.json(profile));
		})
});

/*
// @route   POST api/profile/education
// @desc    Add education to profile
// @access  Private
router.post(
  '/education',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const { errors, isValid } = validateEducationInput(req.body);

    // Check Validation
    if (!isValid) {
      // Return any errors with 400 status
      return res.status(400).json(errors);
    }

    Profile.findOne({ user: req.user.id }).then(profile => {
      const newEdu = {
        school: req.body.school,
        degree: req.body.degree,
        fieldofstudy: req.body.fieldofstudy,
        from: req.body.from,
        to: req.body.to,
        current: req.body.current,
        description: req.body.description
      };

      // Add to exp array
      profile.education.unshift(newEdu);

      profile.save().then(profile => res.json(profile));
    });
  }
);
*/


// @route			POST api/profile/education
// @description 	Add educational background to a profile
// @access			Private
router.post('/education', passport.authenticate('jwt', {session: false}), (req, res) => {
	const {errors, isValid} = validateEducationInput(req.body);

	// Check Validation
	if(!isValid) {
		// Return any errors with a Status 400 response
		return res.status(400).json(errors);
	}

	Profile.findOne({user: req.user.id})
		.then(profile => {
			const newEdu = {
				school: req.body.school,
				degree: req.body.degree,
				fieldOfStudy: req.body.fieldOfStudy,
				from: req.body.from,
				to: req.body.to,
				current: req.body.current,
				description: req.body.description
			}

			// Add to the experience array
			profile.education.unshift(newEdu);

			profile.save()
				.then(profile => res.json(profile));
		});
});

// @route			DELETE api/profile/experience/:exp_id
// @description 	Deleting a particular bit of experience from the profile
// @access			Private
router.delete('/experience/:exp_id', passport.authenticate('jwt', {session: false}), (req, res) => {
	Profile.findOne({user: req.user.id})
		.then(profile => {
			// Get the removal index
			const removeIndex = profile.experience
				.map(item => item.id) // finds everything in the "experience" array
				.indexOf(req.params.exp_id); // identifies the specific thing we want

			// Splice the particular item out of the array
			profile.experience.splice(removeIndex, 1); // finds that specific thing and removes it

			// Saves the newly created array and writes it to disk
			profile.save().then(profile => res.json(profile));
		})
		.catch(err => res.status(404).json(err));
});

// @route			DELETE api/profile/education/:edu_id
// @description 	Deleting a particular bit of education from the profile
// @access			Private
router.delete('/education/:edu_id', passport.authenticate('jwt', {session: false}), (req, res) => {
	Profile.findOne({user: req.user.id})
		.then(profile => {
			// Get the removal index
			const removeIndex = profile.education
				.map(item => item.id) // finds everything in the "education" array
				.indexOf(req.params.edu_id); // identifies the specific thing we want

			// Splice the particular item out of the array
			profile.education.splice(removeIndex, 1); // finds that specific thing and removes it

			// Saves the newly created array and writes it to disk
			profile.save().then(profile => res.json(profile));
		})
		.catch(err => res.status(404).json(err));
});

// @route			DELETE api/profile
// @description 	Deleting an entire user altogether
// @access			Private
router.delete('/', passport.authenticate('jwt', {session: false}), (req, res) => {
	Profile.findOneAndRemove({user: req.user.id})
		.then(() => {
			User.findOneAndRemove({_id: req.user.id})	
			/* Here, we're matching the user I.D. and not
			 * the actual user itself because it's from
			 * the Users collection
			 */
				.then(() => {
					res.json({success: true})
				})
		})
});


module.exports = router;
