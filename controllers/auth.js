// Load required packages
var passport = require('passport');
var localStrategy = require('passport-local').Strategy;
var dataController = require('./data');
var hasher = require('./hasher');

function verifyUserDB(userName, password, next) {
	// Get user from DB
	dataController.authenticateUser(userName, function(err, user) {
		if (err) {
			next(null, false, err);
		}
		if (!user) {
			// There is no such user in the DB
			next(null, false, {
				message : 'Invalid login!'
			});
		} else {
			// The user exist so get his salt and hashed password
			var userSalt = user.key;
			var userHashedPass = user.password;
			var userRole = user.role;
			// Hash the incoming password with the users salt
			var hashedPass = hasher.computeHash(password, userSalt);
			// Compare the two passwords
			if (userHashedPass === hashedPass) {
				// The passwords are the same.
				// TODO verify the role!!!
				next(null, user);
			} else {
				// Wrong password
				next(null, false, {
					message : 'Invalid login!'
				});
			}
		}
	});
}

function createUser(userName, password, role) {
	// Generate a new random salt
	var userSalt = hasher.createSalt();
	// Hash the incoming password with the generated salt
	var userHashedPass = hasher.computeHash(password, userSalt);

	// Save the hashed password with the salt key
	dataController.createUser(userName, userHashedPass, userSalt, role,
			function(err, user) {
				if (err) {
					return null;
				} else {
					return user;
				}
			});
}

passport.use(new localStrategy({
	usernameField : "userid",
	passwordField : "password",
	session : false
}, verifyUserDB));

exports.isAuthenticated = passport.authenticate('local', {
	session : false
});
exports.createUser = createUser;
