const isEmpty = value =>
	value === undefined ||
	value === null ||
	(typeof value === 'object' && Object.keys(value).length === 0) ||
	(typeof value === 'string' && value.trim().length === 0);

module.exports = isEmpty;

/*
function isEmpty(value) {
	return (
		value === undefined ||
		value === null ||
		(typeof value === 'object' && Object.keys(value).length === 0) ||
		(typeof value === 'string' && value.trim().length === 0);
	);
};

module.exports = isEmpty;
*/

/*
module.exports = isEmpty(value) => {
	return (
		value === undefined ||
		value === null ||
		(typeof value === 'object' && Object.keys(value).length === 0) ||
		(typeof value === 'string' && value.trim().length === 0);
	);
};
*/

/*
module.exports = passport => {
	passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
		User.findById(jwt_payload.id)
			.then(user => {
				if(user) {
					// the first parameter would normally be "err", but
					// since we know for a fact that there's no error,
					// we can just define it as null
					return done(null, user);
				}
				return done(null, false);
			})
			.catch(err => console.log(err));
	}));
};
*/
