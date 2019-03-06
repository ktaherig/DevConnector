const Validator = require('validator');
const isEmpty = require('./is-empty');


module.exports = function validateRegisterInput(data){
	let errors = {};

	data.name = !isEmpty(data.name) ? data.name : '' ;
	data.email = !isEmpty(data.email) ? data.email : '' ;
	data.password = !isEmpty(data.password) ? data.password : '' ;
	data.password2 = !isEmpty(data.password2) ? data.password2 : '' ;

	/**
	 * All these "errors.name" are eventually implemented
	 * in client/src/components/auth/Register.js
	 * in order to apply "Required" warnings when a user
	 * doesn't fill in a required field on the Register
	 * page on the front end. The "classnames" package
	 * handles this and Bootstrap provides the CSS change
	 */
	if(!Validator.isLength(data.name, {min:2,max:30})) {
		errors.name = 'Name must be between 2 and 30 characters';
	}

	if(Validator.isEmpty(data.name)) {
		errors.name = "Please enter a name";
	}

	if(Validator.isEmpty(data.email)) {
		errors.email = "Please enter an email address";
	}

	if(!Validator.isEmail(data.email)) {
		errors.email = "Please enter a valid email address";
	}

	if(Validator.isEmpty(data.password)) {
		errors.password = "Please enter a password";
	}

	if(!Validator.isLength(data.password, {min:6,max:30})) {
		errors.password = "Your password must be between 6 and 30 characters.";
	}

	if(Validator.isEmpty(data.password2)) {
		errors.password2 = "Please re-enter your password";
	}

	if(!Validator.equals(data.password, data.password2)) {
		errors.password2 = "Passwords do not match";
	}

	return {
		errors,
		isValid: isEmpty(errors)
	};
};
