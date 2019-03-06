import axios from 'axios';

const setAuthToken = token => {
	if(token) {
		// Apply the token to every request
		axios.defaults.headers.common['Authorization'] = token;
	} else {
		// Delete the Auth Header
		delete axios.defaults.headers.common['Authorization'];
	}
};

export default setAuthToken;
