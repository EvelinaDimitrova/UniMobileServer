var express = require('express');
var fs = require('fs');
var pjson = require('../package.json');

// Verify for imagesRoot configuration in package.json
if (!pjson.imagesRoot) {
	var err = new Error('Missing imagesRoot configuration in package.json');
	console.log(err.message);
	throw err;
}

var router = express.Router();

var imagesRoot = pjson.imagesRoot;

// Retrieve image
router.get('/:imageName', function(req, res, next) {

	var imageName = req.params.imageName;
	var fullFilePath = imagesRoot + '\\' + imageName;

	fs.access(fullFilePath, fs.F_OK, function(err) {
		if (!err) {
			res.set('Content-Type', 'image/jpg');
			res.sendFile(imageName, {
				root : imagesRoot
			});
		} else {
			res.status(404).send();
		}
	});

});

// Delete image
router.delete('/:imageName', function(req, res, next) {

	var imageName = req.params.imageName;
	var fullFilePath = imagesRoot + '\\' + imageName;

	fs.unlink(fullFilePath, function(err) {
		if (!err) {
			res.status(200).send();
		} else {
			res.status(404).send();
		}
	});

});

module.exports = router;
