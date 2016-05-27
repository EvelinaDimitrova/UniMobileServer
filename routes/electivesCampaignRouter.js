var express = require('express');
var router = express.Router();

var authController = require('../controllers/auth');
var dataController = require('../controllers/data');

// Retrieve events
router.get('/', function(req, res, next) {

	dataController.getElectivesCampaign(function(err, data) {
		if (err) {
			console.log(err);
			res.status(500).send(err);
		} else {
			res.json(data);
		}
	});

});

router.get('/courses', authController.isAuthenticated,
		function(req, res, next) {

			var userId = req.body.userid;
			var role = req.user.role;

			if (role === "STUD") {
				dataController.getElectiveCourses(userId, function(err, data) {
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

router.post('/courses/enroll', authController.isAuthenticated, function(req,
		res, next) {

	var userId = req.body.userid;
	var courseId = req.query.courseId;
	var role = req.user.role;

	if (role === "STUD") {
		dataController.enrollCourse(userId, courseId, function(err, data) {
			if (err) {
				console.log(err);
				res.status(500).send(err);
			} else {
				res.status(200).send('Success');
			}
		});
	} else {
		res.status(401).send("Unauthorized");
	}

});

router.post('/courses/cancel', authController.isAuthenticated, function(req,
		res, next) {

	var userId = req.body.userid;
	var courseId = req.query.courseId;
	var role = req.user.role;

	if (role === "STUD") {
		dataController.cancelCourse(userId, courseId, function(err, data) {
			if (err) {
				console.log(err);
				res.status(500).send(err);
			} else {
				res.status(200).send('Success');
			}
		});
	} else {
		res.status(401).send("Unauthorized");
	}
});

module.exports = router;
