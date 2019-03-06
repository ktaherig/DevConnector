const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const UserSchema = new Schema({
	name: {
		type: String,
		required: true
	},
	email: {
		type: String,
		required: true
	},
	password: {
		type: String,
		required: true
	},
	avatar: {
		type: String,
		required: false	// this is because, whether Gravatar or not,
						// every user will have an avatar image in
						// some form or another
	},
	date: {
		type: Date,
		default: Date.now
	},
});

module.exports = User = mongoose.model('users', UserSchema);
