/* include express web framework */
var express = require('express');
/* include path for correct paths */
var path = require('path');
/* require db */
var mongoose = require('mongoose');
/* parse information from post requests */
var bodyParser = require('body-parser');
/* simulate DELETE and PUT requests */
var methodOverride = require('method-override');

/* connect to db */
mongoose.connect('mongodb://tech:testing@ds157459.mlab.com:57459/tallyapp');

/* initialize app as express app */
var app = express();

/* set port */
app.set('port', (process.env.PORT || 5000));

/* set static custom file location */
app.use('/custom', express.static(__dirname + '/public'));

/* set static node_modules location */
app.use('/libs', express.static(__dirname + '/node_modules/'));

/* body-parser config */
app.use(bodyParser.urlencoded({'extended': 'true'}));
app.use(bodyParser.json());
app.use(bodyParser.json({type: 'application/vnd.api+json'}));

/* init method-override */
app.use(methodOverride());

/* DB Student model */
var Student = mongoose.model('Student', {
	site: String,
	fname: String,
	lname: String,
	date: { type: Date, default: Date.now }
});

/* API */

// get all students
app.get('/api/students', function(req, res) {

	Student.find(function(err, students) {
		if (err) {
			res.send(err);
		} else {
			res.json(students);
		}
	});

});

// add student
app.post('/api/students', function(req, res) {

	/* any post request to /api/students */
	/* data will be available in the req param */
	/* parsed by body-parser */
	Student.create({
		site: req.body.site,
		fname: req.body.fname,
		lname: req.body.lname
	}, function(err, student) {
		if (err) {
			res.send(err);
		} else {
			res.sendStatus(200);
		}
	});

});

// delete student
app.delete('/api/students/:id', function(req, res) {

	/* params populated by api url */
	Student.remove({
		_id: req.params.id
	}, function(err, student) {
		if (err) {
			res.send(err);
		} else {
			/* return all students after add */
			Student.find(function(err, students) {
				if (err) {
					res.send(err);
				} else {
					res.json(students);
				}
			});
		}
	});

});

// send all requests to angular angular frontend (index.html) */
app.get('*', function(req, res) {
	res.sendFile(path.join(__dirname, '/public/index.html'));
});

/* start server */
app.listen(app.get('port'), function() {
	console.log('App started on port', app.get('port'));
});