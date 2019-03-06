const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateEducationInput(data){
	console.log(data);
	let errors = {};

	data.school = !isEmpty(data.school) ? data.school : '' ;
	data.degree = !isEmpty(data.degree) ? data.degree : '' ;
	data.fieldOfStudy = !isEmpty(data.fieldOfStudy) ? data.fieldOfStudy : '' ;
	data.from = !isEmpty(data.from) ? data.from : '' ;
	data.current = !isEmpty(data.current) ? data.current : '' ;
	data.description = !isEmpty(data.description) ? data.description : '' ;

	// this comes last because otherwise, the server will
	// tell you to enter a --valid-- email address
	if(Validator.isEmpty(data.school)) {
		errors.school = "Please enter a school name.";
	}

	if(Validator.isEmpty(data.degree)) {
		errors.degree = "Please enter a degree title.";
	}

	if(Validator.isEmpty(data.fieldOfStudy)) {
		errors.fieldOfStudy = "Please enter a field of study.";
	}

	if(Validator.isEmpty(data.from)) {
		errors.from = "Please enter a start date.";
	}

	return {
		errors,
		isValid: isEmpty(errors)
	};
};
