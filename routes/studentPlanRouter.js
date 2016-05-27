var express = require('express');
var router = express.Router();

var authController = require('../controllers/auth');
var dataController = require('../controllers/data');

// Retrieve student schedule
router.get('/', authController.isAuthenticated, function(req, res, next) {
	var role = req.user.role;
	if (role === "STUD") {
		dataController.getStudentPlan(req.body.userid, function(err, data) {
			if (err) {
				console.log(err);
				res.status(500).send(err);
			} else {
				res.json(data);
			}
		});
	} else {
		res.status(401).send("Unauthorized");
	}
});

module.exports = router;
