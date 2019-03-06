import axios from 'axios';
import {GET_ERRORS, SET_CURRENT_USER} from './types';
import setAuthToken from '../utils/setAuthToken';
import jwt_decode from 'jwt-decode';

// Register a user
export const registerUser = (userData, history) => dispatch => {
	axios
		.post('/api/users/register', userData)
		.then(res => history.push('/login'))
		.catch(err => 
			dispatch({
				type: GET_ERRORS,
				payload: err.response.data
			})
		);
};

// Login: Get user token
export const loginUser = userData => dispatch => {
	axios.post('/api/users/login', userData)
		.then(res => {
			// Save to local storage
			const {token} = res.data;
			// Set token to local storage
			//Local storage only stores strings
			localStorage.setItem('jwtToken', token);
			// Set the token to the Auth Header
			setAuthToken(token);
			// Decode the token to get the user data
			const decoded = jwt_decode(token);
			// Set the current user
			dispatch(setCurrentUser(decoded));
		})
		.catch(err => 
			dispatch({
				type: GET_ERRORS,
				payload: err.response.data
			})
		);
};

// Set the logged-in user
export const setCurrentUser = (decoded) => {
	return {
		type: SET_CURRENT_USER,
		payload: decoded
	}
};

// Log user out
export const logoutUser = () => dispatch => {
	// Remove the token from local storage
	localStorage.removeItem('jwtToken');
	// Remove the auth header for future requests
	setAuthToken(false);
	// Set the current user to an empty object
	// which will also set isAuthenticated to false
	dispatch(setCurrentUser({}));
}
