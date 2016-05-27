var mysql = require("mysql");
var pjson = require('../package.json');

//Verify for valid DB configuration in package.json
if (!pjson.dbConfiguration || !pjson.dbConfiguration.host ||
	!pjson.dbConfiguration.user || !pjson.dbConfiguration.password || 
	!pjson.dbConfiguration.database || !pjson.dbConfiguration.timezone) {
	var err = new Error('Missing DB configuration in package.json');
	console.log(err.message);
	throw err;
}

var con = mysql.createConnection({
	host : pjson.dbConfiguration.host,
	user : pjson.dbConfiguration.user,
	password : pjson.dbConfiguration.password,
	database : pjson.dbConfiguration.database,
	timezone : pjson.dbConfiguration.timezone
});

function connect() {
	con.connect(function(err) {
		if (err) {
			console.log(err);
			console.log('Error connecting to Db');
			return;
		}
		console.log('Connection established');
	});
}

function getStudentSchedule(studentId, callback) {
	con.query('CALL GetStudentSchedule(\'' + studentId + '\')', function(err,
			rows) {
		if (err) {
			return callback(err, null);
		}

		// console.log('GetStudentSchedule Data received from Db:\n');
		// console.log(rows[0]);

		callback(null, rows[0]);
	});

}

function getLecturerSchedule(lecturerId, callback) {
	con.query('CALL GetLecturerSchedule(\'' + lecturerId + '\')', function(err,
			rows) {
		if (err) {
			return callback(err, null);
		}

		// console.log('GetLecturerSchedule Data received from Db:\n');
		// console.log(rows[0]);

		callback(null, rows[0]);
	});

}

function getEvents(callback) {
	con.query('CALL GetEvents()', function(err, rows) {
		if (err) {
			return callback(err, null);
		}

		//console.log('GetEvents Data received from Db:\n');
		//console.log(rows[0]);

		callback(null, rows[0]);
	});

}

function authenticateUser(userid, callback) {
	con.query('CALL AuthenticateUser(\'' + userid + '\')', function(err, rows) {
		if (err) {
			return callback(err, null);
		}
		if (rows[0].length === 0) {
			return callback({
				message : 'No such user'
			}, null);
		}

		// console.log('authenticateUser Data received from Db:\n');
		// console.log(rows[0][0]);

		return callback(null, rows[0][0]);
	});
}

function getNews(newsId, chunkSize, fullContent, callback) {
	con.query('CALL GetNews(' + newsId + ',' + chunkSize + ',\'' + fullContent + '\')', function(err,
			rows) {
		if (err) {
			return callback(err, null);
		}

		// console.log('GetNews Data received from Db:\n');
		// console.log(rows[0]);

		callback(null, rows[0]);
	});
}

function getNewsDetail(newsId, fullContent, callback) {
	con.query('CALL GetNewsDetail(' + newsId + ',\'' + fullContent + '\')', function(err, rows) {
		if (err) {
			return callback(err, null);
		}

		// console.log('GetNews Data received from Db:\n');
		// console.log(rows[0][0]);

		callback(null, rows[0][0]);
	});
}

function getStudentPlan(userId, callback) {
	con.query('CALL GetStudentPlan(\'' + userId + '\')', function(err, rows) {
		if (err) {
			return callback(err, null);
		}

		// console.log('GetStudentPlan Data received from Db:\n');
		// console.log(JSON.parse(rows[0][0].data));

		callback(null, JSON.parse(rows[0][0].data));
	});
}

function getElectivesCampaign(callback) {
	con.query('CALL GetElectivesCampaign()', function(err, rows) {
		if (err) {
			return callback(err, null);
		}

		// console.log('GetElectivesCampaign Data received from Db:\n');
		// console.log(rows[0][0]);

		callback(null, rows[0][0]);
	});
}

function getElectiveCourses(userId, callback) {
	con.query('CALL GetElectiveCourses(\'' + userId + '\')',
			function(err, rows) {
				if (err) {
					return callback(err, null);
				}

				// console.log('GetElectiveCourses Data received from Db:\n');
				// console.log(rows[0]);

				callback(null, rows[0]);
			});
}

function enrollCourse(userId, courseId, callback) {
	con.query('CALL EnrollCourse(\'' + userId + '\',' + courseId + ')',
			function(err, rows) {
				if (err) {
					return callback(err, null);
				}

				// console.log('EnrollCourse Data received from Db:\n');
				// console.log(rows);

				callback(null, true);
			});
}

function cancelCourse(userId, courseId, callback) {
	con.query('CALL CancelCourse(\'' + userId + '\',' + courseId + ')',
			function(err, rows) {
				if (err) {
					return callback(err, null);
				}

				// console.log('CancelCourse Data received from Db:\n');
				// console.log(rows);

				callback(null, true);
			});
}

function addNews(title, text, callback) {
	con.query('CALL AddNews(\'' + title + '\',\'' + text + '\')', function(err,
			rows) {
		if (err) {
			return callback(err, null);
		}

		// console.log('AddNews Data received from Db:\n');
		// console.log(rows[0]);

		callback(null, rows[0][0]);
	});
}

function addNewsImage(newsId, imageName, callback) {
	con.query('CALL AddNewsImage(' + newsId + ',\'' + imageName + '\')',
			function(err, rows) {
				if (err) {
					return callback(err, null);
				}

				// console.log('AddNewsImage Data received from Db:\n');
				// console.log(rows[0]);

				callback(null, true);
			});
}

function deleteNews(newsId, callback) {
	con.query('CALL DeleteNews(' + newsId + ')', function(err, rows) {
		if (err) {
			return callback(err, null);
		}

		// console.log('DeleteNews Data received from Db:\n');
		// console.log(rows[0]);

		callback(null, true);
	});
}
function getAdministrationContacts(callback) {
	con.query('CALL GetAdministrationContacts()', function(err, rows) {
		if (err) {
			return callback(err, null);
		}

		// Transform the contacts data to JSON
		for (var i = 0; i < rows[0].length; i++) {
			rows[0][i].data = JSON.parse(rows[0][i].data);
		}

		// console.log('GetAdministrationContacts Data received from Db:\n');
		// console.log(rows[0]);

		callback(null, rows[0]);
	});
}

function getLecturersContacts(callback) {
	con.query('CALL GetLecturersContacts()', function(err, rows) {
		if (err) {
			return callback(err, null);
		}

		// console.log('GetLecturersContacts Data received from Db:\n');
		// console.log(rows[0]);

		for (var i = 0; i < rows[0].length; i++) {
			rows[0][i].contacts = JSON.parse(rows[0][i].contacts);
		}

		// console.log('GetLecturersContacts Data received from
		// Db(transformed):\n');
		// console.log(rows[0]);

		callback(null, rows[0]);
	});
}

function getRooms(callback) {
	con.query('CALL GetRooms()', function(err, rows) {
		if (err) {
			return callback(err, null);
		}

		// console.log('GetRooms Data received from Db:\n');
		// console.log(rows[0]);

		callback(null, rows[0]);
	});

}

function addEvent(abbreviation, title, eventDate, startTime, endTime, roomId,
		description, callback) {
	var query = 'CALL AddEvent(\'' + abbreviation + '\',\'' + title + '\',\''
			+ description + '\',\'' + eventDate + '\',\'' + startTime + '\',\''
			+ endTime + '\',' + roomId + ')';
	// console.log(query);
	con.query(query, function(err, rows) {
		if (err) {
			return callback(err, null);
		}

		// console.log('GetRooms Data received from Db:\n');
		// console.log(rows[0]);

		callback(null, true);
	});

}

function createUser(userName, password, key, role, callback) {
	con.query('CALL CreateUser(\'' + userName + '\',\'' + password + '\',\''
			+ key + '\',\'' + role + '\')', function(err, rows) {
		if (err) {
			return callback(err, null);
		}

		// console.log('CreateUser Data received from Db:\n');
		// console.log(rows[0][0]);

		callback(null, true);
	});

}

function deleteEvent(eventId, callback) {
	con.query('CALL DeleteEvent(' + eventId + ')', function(err,

	rows) {
		if (err) {
			return callback(err, null);
		}

		// console.log('DeleteEvent Data received from Db:\n');
		// console.log(rows[0]);

		callback(null, true);
	});
}

// connect();

exports.getEvents = getEvents;
exports.getStudentSchedule = getStudentSchedule;
exports.authenticateUser = authenticateUser;
exports.getNews = getNews;
exports.getNewsDetail = getNewsDetail;
exports.getStudentPlan = getStudentPlan;
exports.getLecturerSchedule = getLecturerSchedule;
exports.getElectivesCampaign = getElectivesCampaign;
exports.getElectiveCourses = getElectiveCourses;
exports.enrollCourse = enrollCourse;
exports.cancelCourse = cancelCourse;
exports.addNews = addNews;
exports.addNewsImage = addNewsImage;
exports.deleteNews = deleteNews;
exports.getAdministrationContacts = getAdministrationContacts;
exports.getLecturersContacts = getLecturersContacts;
exports.getRooms = getRooms;
exports.addEvent = addEvent;
exports.deleteEvent = deleteEvent;
exports.createUser = createUser;