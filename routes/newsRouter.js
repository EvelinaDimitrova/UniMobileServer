var express = require('express');
var router = express.Router();
var multer = require('multer');

var authController = require('../controllers/auth');
var dataController = require('../controllers/data');
var pjson = require('../package.json');

//Verify for imagesRoot configuration in package.json
if (!pjson.imagesRoot) {
	var err = new Error('Missing imagesRoot configuration in package.json');
	console.log(err.message);
	throw err;
}

var storage = multer.diskStorage({
	destination : function(req, file, cb) {
		cb(null, pjson.imagesRoot);
	},
	filename : function(req, file, cb) {
		cb(null, file.originalname + '.jpg');
	}
});

var upload = multer({
	storage : storage
});

// Retrieve news
router.get('/', function(req, res, next) {

	var newsId = req.query.newsId;
	var chunkSize = req.query.chunkSize;	

	var fullContent = "Y";
	//Verify the caller contectMode - "Full" or "Compact"
	var contentMode = req.headers.contentmode;
	//console.log("contentMode=" + contentMode);
	if (contentMode && contentMode === "Compact"){
		fullContent = "N";
	}

	dataController.getNews(newsId, chunkSize, fullContent, function(err, data) {
		if (err) {
			console.log(err);
			res.status(500).send(err);
		} else {
			res.json(data);
		}
	});

});

router.post('/', authController.isAuthenticated, function(req, res, next) {

	var newsTitle = req.body.title;
	var newsText = req.body.text;
	var role = req.user.role;

	if (role === "LECT" || role === "ADMN") {
		dataController.addNews(newsTitle, newsText, function(err, data) {
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

router.post('/image', upload.array('file'), function(req, res, next) {

	var newsId = req.query.newsId;
	var fileName = req.files[0].filename;

	dataController.addNewsImage(newsId, fileName, function(err, data) {
		if (err) {
			console.log(err);
			res.status(500).send(err);
		} else {
			res.status(200).send();
		}
	});

});

router.get('/:newsId', function(req, res, next) {

	var newsId = req.params.newsId;
	var fullContent = "Y";
	//Verify the caller contectMode - "Full" or "Compact"
	var contentMode = req.headers.contentmode;
	//console.log("contentMode=" + contentMode);
	if (contentMode && contentMode === "Compact"){
		fullContent = "N";
	}

	 
	dataController.getNewsDetail(newsId, fullContent, function(err, data) {
		if (err) {
			console.log(err);
			res.status(500).send(err);
		} else {
			res.json(data);
		}
	});

});

router.delete('/:newsId', authController.isAuthenticated,
		function(req, res, next) {

			var newsId = req.params.newsId;
			var role = req.user.role;

			if (role === "ADMN") {
				dataController.deleteNews(newsId, function(err, data) {
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