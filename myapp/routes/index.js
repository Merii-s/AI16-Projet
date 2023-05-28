var express = require('express');
var router = express.Router();
var ficheModel = require('../model/ficheposte.js');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/inscription', function(req, res, next) {
  res.render('inscription');
});


module.exports = router;
