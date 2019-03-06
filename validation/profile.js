const Validator = require('validator');
const isEmpty = require('./is-empty');


module.exports = function validateProfileInput(data){
	let errors = {};

	data.handle = !isEmpty(data.handle) ? data.handle : '' ;
	data.status = !isEmpty(data.status) ? data.status : '' ;
	data.skills = !isEmpty(data.skills) ? data.skills : '' ;

	/**
	 * These following four blocks are for checking whether
	 * the account data provided by the user is valid
	 */
	if(!Validator.isLength(data.handle, {min:2,max:40})) {
		errors.handle = "The handle must be between 2 and 40 characters.";
	}

	if(Validator.isEmpty(data.handle)) {
		errors.handle = "You must provide a profile handle.";
	}

	if(Validator.isEmpty(data.status)) {
		errors.status = "You must provide a status.";
	}

	if(Validator.isEmpty(data.skills)) {
		errors.skills = "You must provide a skillset.";
	}

	if (!isEmpty(data.website)) {
		if (!Validator.isURL(data.website)) {
			errors.website = 'Not a valid URL';
		}
	}

	/**
	 * The next five Validator blocks are to check for
	 * the social media website links.
	 *
	 * Each block is for Youtube, Twitter, Gab, LinkedIn,
	 * and Instagram, respectively.
	 *
	 * The reason why we're checking "!isEmpty" is because:
	 * 1.) They're not required, so they can be empty, and
	 * 2.) If a user DOES enter something in any of those
	 * 		fields, then their entries need to be valid.
	 */
	if(!isEmpty(data.youtube)) {
		if(!Validator.isURL(data.youtube)) {
			errors.youtube = "This must be a valid Youtube page URL.";
		}
	}

	if(!isEmpty(data.twitter)) {
		if(!Validator.isURL(data.twitter)) {
			errors.twitter = "This must be a valid Twitter URL.";
		}
	}

	if(!isEmpty(data.gab)) {
		if(!Validator.isURL(data.gab)) {
			errors.gab = "This must be a valid Gab URL.";
		}
	}

	if(!isEmpty(data.linkedin)) {
		if(!Validator.isURL(data.linkedin)) {
			errors.linkedin = "This must be a valid LinkedIn URL.";
		}
	}

	if(!isEmpty(data.instagram)) {
		if(!Validator.isURL(data.instagram)) {
			errors.instagram = "This must be a valid Instagram URL.";
		}
	}
	/**
	 * END OF SOCIAL MEDIA CHECKS
	 */

	return {
		errors,
		isValid: isEmpty(errors)
	};
};
