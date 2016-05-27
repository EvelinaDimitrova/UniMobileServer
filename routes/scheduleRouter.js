var express = require('express');
var router = express.Router();

var authController = require('../controllers/auth');
var dataController = require('../controllers/data');

// Retrieve recurring schedule events
router.get('/', authController.isAuthenticated, function(req, res, next) {

	var userId = req.user.username;
	var role = req.user.role;

	// console.log("userId=" + userId);
	// console.log("role=" + role);

	if (role === "STUD") {
		dataController.getStudentSchedule(userId, function(err, data) {
			if (err) {
				console.log(err);
				res.status(500).send(err);
			} else {
				return res.json(data);
			}
		});
	} else if (role === "LECT") {
		dataController.getLecturerSchedule(userId, function(err, data) {
			if (err) {
				console.log(err);
				res.status(500).send(err);
			} else {
				res.json(data);
			}
		});
	} else {
		// Send invalid request;
		res.status(400).send();
	}
});

// Retrieve events
router.get('/events', function(req, res, next) {

	dataController.getEvents(function(err, data) {
		if (err) {
			console.log(err);
			// / / Do something with the error
		} else {
			res.json(data);
		}
	});

});

// Retrieve events
router.post('/events', function(req, res, next) {

	console.log(req.body);
	var data = req.body;

	dataController.addEvent(data.abbreviation, data.name, data.event_date,
			data.start_time, data.end_time, data.room_id, data.description,
			function(err, data) {
				if (err) {
					console.log(err);
					res.status(500).send();
				} else {
					res.status(200).send();
				}
			});

});

// Retrieve events
router.get('/events/rooms', function(req, res, next) {

	dataController.getRooms(function(err, data) {
		if (err) {
			console.log(err);
			// / / Do something with the error
		} else {
			res.json(data);
		}
	});

});

router.delete('/events/:eventId', authController.isAuthenticated, function(req,
		res, next) {

	var eventId = req.params.eventId;
	var role = req.user.role;

	if (role === "ADMN") {
		dataController.deleteEvent(eventId, function(err, data) {
			if (err) {
				console.log(err);
				res.status(500).send(err);
			} else {
				res.status(200).send();
			}
		});
	} else {
		res.status(401).send("Unauthorized");
	}
});

module.exports = router;
