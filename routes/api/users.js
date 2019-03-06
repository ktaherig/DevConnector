const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const passport = require('passport');
const keys = require('../../config/keys');

// Load Input Validation
const validateRegisterInput = require('../../validation/register');
const validateLoginInput = require('../../validation/login');

// Load User Model
const User = require('../../models/User');

// @route			GET api/users/test
// @description 	Tests the "users" route
// @access			Public
router.get('/test', (req, res) => res.json({msg: "The \"Users\" route works as expected."}));

// @route			POST api/users/register
// @description 	User registration
// @access			Public
router.post('/register', (req, res) => {
	const {errors, isValid} = validateRegisterInput(req.body);

	// Check Validation
	if(!isValid) {
		return res.status(400).json(errors);
	}

	User.findOne({ email: req.body.email })
		.then(user => {
			if(user) {
				errors.email = 'This email is already registered.';
				return res.status(400).json({ errors });
			} else {
				const avatar = gravatar.url(req.body.email, {
					s: '200', // the size of the image
					r: 'pg', // the rating for the image (i.e., G, PG, PG-13, R, etc
					d: 'mm' // gives a default image if no gravatar is provided
				});
				const newUser = new User({
					name: req.body.name,
					email: req.body.email,
					avatar, // this is new as of ES6
					password: req.body.password
				});

				bcrypt.genSalt(10, (err, salt) => {
					bcrypt.hash(newUser.password, salt, (err, hash) => {
						if(err) throw err;
						newUser.password = hash;
						newUser.save()
							.then(user => res.json(user))
							.catch(err => console.log(err));
					})
				})
			}
		})
});

// @route			GET api/users/login
// @description 	Login page / returning the JSON web token
// @access			Public
router.post('/login', (req, res) => {
	const {errors, isValid} = validateLoginInput(req.body);

	// Check Validation
	if(!isValid) {
		return res.status(400).json(errors);
	}

	const email = req.body.email;
	const password = req.body.password;

	// find the user by email
	//
	// We only need to write "email" once, because
	// the database email and the input email have
	// the same name
	User.findOne({email})
		.then(user => {
			// Check for user
			if(!user) {
				errors.email = "User not found";
				return res.status(404).json(errors);
			}

			// Check password
			bcrypt.compare(password, user.password)
				.then(isMatch => {
					if(isMatch) {
						// User Matched

						// Create the JSON Web Token payload
						const payload = { id: user.id, name: user.name, avatar: user.avatar }

						// Sign the token
						jwt.sign(
							payload,
							keys.secretOrKey,
							{ expiresIn: 3600 },
							(err, token) => {
								res.json({
									success: true,
									token: 'Bearer ' + token
								});
						});
					} else {
						errors.password = "Password incorrect";
						return res.status(400).json(errors);
					}
				})
		})
});

// @route			GET api/users/current
// @description 	Return the current user (for testing purposes)
// @access			Private
router.get('/current', passport.authenticate('jwt', {session: false}), (req, res) => {
	res.json(req.user);
});

module.exports = router;
