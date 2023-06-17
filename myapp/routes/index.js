var express = require('express');
var router = express.Router();
const mysql = require('mysql');
var session= require('../session');
const path = require('path');



var conn = mysql.createConnection({
  host: "tuxa.sme.utc", //ou localhost
  user: "ai16p054", //"ai16p002",
  password: "89PRl9zx2fnh",//'pzT76bJadOfPduAV',
  database: "ai16p054"//"ai16p002"
});

router.use(express.json());
router.use(express.urlencoded({ extended: true }));
router.use(express.static(path.join(__dirname, 'static')));


// http://localhost:3000/
router.get('/', function(request, response) {
	// Render login template
  response.render('index', { title: 'Express' });
});

// http://localhost:3000/auth
router.post('/auth', function(request, response) {
	// Capture the input fields
	let email = request.body.email;
	let password = request.body.password;
	// Ensure the input fields exists and are not empty
	if (email && password) {
		// Execute SQL query that'll select the account from the database based on the specified username and password
		conn.query('SELECT * FROM Users WHERE email = ? AND motdepasse = ?', [email, password], function(error, results, fields) {
			// If there is an issue with the query, output the error
			if (error) throw error;
			// If the account exists
			if (results.length > 0) {
				// Authenticate the user
				session.creatSession(request.session, email, results[0].type, results[0].prenom, results[0].nom);
				// Redirect to home page
				if (results[0].type === 'candidat'){
					console.log("c'est un candidat");
					response.redirect('/users');
				}
				if (results[0].type === 'recruteur'){
					console.log("c'est un recruteur");
					response.redirect('/recruteur');
				} 
				if(results[0].type === 'admin') {
					console.log("c'est un admin");
					response.redirect('admin/userslist');
				}
			} else {
				response.send('Incorrect Username and/or Password!');
			}			
			response.end();
		});
	} else {
		response.send('Please enter Username and Password!');
		response.end();
	}
});

// http://localhost:3000/home
router.get('/home', function(request, response) {
	// If the user is loggedin
	if (request.session.loggedin) {
		// Output username
		response.redirect('/users');
	} else {
		// Not logged in
		response.send('Please login to view this page!');
	}
	response.end();
});


router.get('/inscription', function(req, res, next) {
  res.render('inscription');
});


module.exports = router;
