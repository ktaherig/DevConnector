const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const mongoose = require('mongoose');
const User = mongoose.model('users'); // this comes from the User.js file in /models/
const keys = require('./keys');

const opts = {}; // an empty object for options
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = keys.secretOrKey;

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
