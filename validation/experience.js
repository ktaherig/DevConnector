const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateExperienceInput(data){
	let errors = {};

	data.title = !isEmpty(data.title) ? data.title : '' ;
	data.company = !isEmpty(data.company) ? data.company : '' ;
	data.from = !isEmpty(data.from) ? data.from : '' ;

	// this comes last because otherwise, the server will
	// tell you to enter a --valid-- email address
	if(Validator.isEmpty(data.title)) {
		errors.title = "Please enter a job title.";
	}

	if(Validator.isEmpty(data.company)) {
		errors.company = "Please enter a company name.";
	}

	if(Validator.isEmpty(data.from)) {
		errors.from = "Please enter a start date.";
	}

	return {
		errors,
		isValid: isEmpty(errors)
	};
};
