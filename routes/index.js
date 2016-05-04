var express = require('express');
var router = express.Router();
var models = require('../models');

// var Artist = models.Artist;
// var Song = models.Song;

router.get('/', function(req, res, next){
  console.log("You've reached the home page");
  res.send("Hello world.");
});


module.exports = router;