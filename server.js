var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var Beer = require('./app/models/beer');

// CONFIGURE THE APP
// ===================
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var port = process.env.PORT || 8080;

// CONNECT TO LOCAL DB
// ===================
mongoose.connect('mongodb://localhost/beers');

// ROUTES FOR API
// ===================
var router = express.Router();

// middleware -- this sends a msg to the terminal right now
router.use(function(req, res, next) {
    console.log('hey! a request is happening');
    next();
});

// test route -- this renders a JSON response in postman
router.get('/', function(req, res) {
    res.json({ message: 'it works!' });
});

// GET, POST to /api/beers
router.route('/beers')
	.post(function(req, res) {
		var beer = new Beer();
		beer.name = req.body.name;
		beer.brewery = req.body.brewery;
		beer.save(function(err) {
			if (err) res.send(err);
			res.json({message: 'you created a beer!'});
		})
	})
	.get(function(req, res) {
		Beer.find(function (err, beers) {
			if (err) res.send(err);
			res.json(beers);
		})
	});

// REGISTER ROUTES
// ===================
app.use('/api', router);

// START THE SERVER
// ===================

app.listen(port);
console.log('Magic happens on port ' + port);

