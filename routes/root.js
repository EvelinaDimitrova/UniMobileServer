var express = require('express');
var router = express.Router();

/*
 * Authentication middleware Extracts the authorization header, decodes the
 * userid and passoword and adds them to the request
 */
router.use(function(req, res, next) {
	if (req.headers.authorization) {
		var encoded = req.headers.authorization.split(' ')[1];
		var decoded = new Buffer(encoded, 'base64').toString('utf8');

		req.body.userid = decoded.split(':')[0];
		req.body.password = decoded.split(':')[1];
	}
	next();
});

module.exports = router;
