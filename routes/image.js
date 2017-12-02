var express = require('express');
var router = express.Router();
var Image = require("../models/image");
var fs = require('fs');


router.get('/', function(req, res){

	
})

//post files
router.post('/upload', function(req, res){

	var bitmap = fs.readFileSync(req.body.image);
	var buf = new Buffer(bitmap).toString('base64');

	var newImage = ({
		image: buf,
  		date: req.body.date,
  		password: req.body.password
	})
	newImage.save(function(err, newPost) {
		if(err){
			throw err;
		}
		res.redirect('/');
	})
})

//post delete flyers
router.post('/')


module.exports = router;