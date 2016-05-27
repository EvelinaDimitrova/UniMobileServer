var express = require('express');
var authController = require('../controllers/auth');

var router = express.Router();

/* authenticate */
router.get('/', authController.isAuthenticated, function(req, res, next) {
	//console.log(req.headers.network);
	// res.status(200).send('Signed in');
	res.json(req.user);
});

//create user
router.post('/', function(req, res, next) {
	var userName = req.body.userName;
	var password = req.body.password;
	var role = req.body.role;
	console.log(req.body);

	var user = authController.createUser(userName, password, role);
	if (user !== null) {
		res.status(200).send();
	} else {
		res.status(500).send();
	}
});

module.exports = router;
