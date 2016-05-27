var express = require('express');
var router = express.Router();

var dataController = require('../controllers/data');


router.get('/administration', function(req, res, next) {

	dataController.getAdministrationContacts(function(err, data) {
		if (err) {
			console.log(err);
			res.status(500).send(err);
		} else {
			res.json(data);
		}
	});
});


router.get('/lecturers', function(req, res, next) {

	dataController.getLecturersContacts(function(err, data) {
		if (err) {
			console.log(err);
			res.status(500).send(err);
		} else {
			res.json(data);
		}
	});
});

module.exports = router;
