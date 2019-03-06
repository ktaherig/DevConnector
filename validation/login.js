const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateLoginInput(data){
	let errors = {};

	data.email = !isEmpty(data.email) ? data.email : '' ;
	data.password = !isEmpty(data.password) ? data.password : '' ;

	if(!Validator.isEmail(data.email)) {
		errors.email = "Please enter a valid email address";
	}

	if(Validator.isEmpty(data.password)) {
		errors.password = "Please enter a password";
	}

	// this comes last because otherwise, the server will
	// tell you to enter a --valid-- email address
	if(Validator.isEmpty(data.email)) {
		errors.email = "Please enter an email address";
	}

	return {
		errors,
		isValid: isEmpty(errors)
	};
};
