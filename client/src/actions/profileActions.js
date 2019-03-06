import axios from 'axios';

import {GET_PROFILE, GET_PROFILES, PROFILE_LOADING, GET_ERRORS, CLEAR_CURRENT_PROFILE, SET_CURRENT_USER} from './types';

// Profile Loading
export const setProfileLoading = () => {
	return {
		type: PROFILE_LOADING
	};
};

// Clear the profile
export const clearCurrentProfile = () => {
	return {
		type: CLEAR_CURRENT_PROFILE
	};
};

// Create a new profile
export const createProfile = (profileData, history) => dispatch => {
	axios
		.post('/api/profile', profileData)
		.then(res => history.push('/dashboard'))
		.catch(err =>
			dispatch({
				type: GET_ERRORS,
				payload: err.response.data
			})
		);
};

// Get the current profile
export const getCurrentProfile = () => dispatch => {
	dispatch(setProfileLoading());
	axios.get('/api/profile')
		.then(res => 
			dispatch({
				type: GET_PROFILE,
				payload: res.data
			})
		)
		.catch(err => 
			dispatch({
				/**
				 * If there isn't a profile, then we'll return
				 * an empty object as the profile, because you
				 * are able to register as a user and still not 
				 * have a profile. So, if somebody has an account,
				 * but they haven't yet created a profile, they
				 * are still able to access the site and the
				 * page, and they'll be presented with a button
				 * asking them to create a profile. That will
				 * then redirect them to the form with the bio
				 * field, work experience field, etc etc
				 */
				type: GET_PROFILE,
				payload: {}
			})
		);
};

// Get Profile by User Handle
export const getProfileByHandle = (handle) => dispatch => {
	dispatch(setProfileLoading());
	axios.get(`/api/profile/handle/${handle}`)
		.then(res => 
			dispatch({
				type: GET_PROFILE,
				payload: res.data
			})
		)
		.catch(err => 
			dispatch({
				type: GET_PROFILE,
				payload: null
			})
		);
};

// Add Experience
export const addExperience = (expData, history) => dispatch => {
	axios
		.post('/api/profile/experience', expData)
		.then(res => history.push('/dashboard'))
		.catch(err => 
			dispatch({
				type: GET_ERRORS,
				payload: err.response.data
			})
		);
};

// Add Education
export const addEducation = (eduData, history) => dispatch => {
	axios
		.post('/api/profile/education', eduData)
		.then(res => history.push('/dashboard'))
		.catch(err => 
			dispatch({
				type: GET_ERRORS,
				payload: err.response.data
			})
		);
};

// Delete Experience
export const deleteExperience = id => dispatch => {
	axios
		.delete(`/api/profile/experience/${id}`)
		.then(res => 
			dispatch({
				type: GET_PROFILE,
				payload: res.data
			})
		)
		.catch(err => 
			dispatch({
				type: GET_ERRORS,
				payload: err.response.data
			})
		);
};

// Delete Education
export const deleteEducation = id => dispatch => {
	axios
		.delete(`/api/profile/education/${id}`)
		.then(res => 
			dispatch({
				type: GET_PROFILE,
				payload: res.data
			})
		)
		.catch(err => 
			dispatch({
				type: GET_ERRORS,
				payload: err.response.data
			})
		);
};

// Get all profiles
export const getProfiles = () => dispatch => {
	dispatch(setProfileLoading());
	axios
		.get('/api/profile/all')
		.then(res => 
			dispatch({
				type: GET_PROFILES,
				payload: res.data
			})
		)
		.catch(err => 
			dispatch({
				type: GET_PROFILES,
				payload: null
			})
		);
};

// Delete Account and Profile
export const deleteAccount = () => dispatch => {
	if(window.confirm('Are you sure you want to delete your account? This is irreversible.')) {
		axios
			.delete('/api/profile')
			.then(res => 
				dispatch({
					type: SET_CURRENT_USER,
					payload: {}
				})
			)
			.catch(err => 
				dispatch ({
					type: GET_ERRORS,
					payload: err.response.data
				})
			);
	}
};
