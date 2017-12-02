var express = require('express');
var router = express.Router();
var Image = require("../models/image");
var fs = require('fs');
var Jimp = require('jimp');
var multer = require('multer');
var upload = multer({dest: 'uploads/'});
var Promise = require('bluebird')
var fileType = require('file-type');
router.get('/', function(req, res){
  Image.find({}, function(err, images) {
    console.log(images[0].image);
    res.render('index', {image: images[0].image});
  })
})

//post files
router.post('/upload', function(req, res){
  console.log(req.body);
  console.log(req.files);
  let promises = [];
  let promise = new Promise((resolve, reject)=>{

            //Resolve image file type
            let type = fileType(req.files.image.data);

            //Create a jimp instance for this image
            new Jimp(req.files.image.data, (err, image)=>{

                //Resize this image
                image.resize(512, 512)
                    //lower the quality by 90%
                    .quality(10)
                    .getBuffer(type.mime, (err, buffer)=>{
                        //Transfer image file buffer to base64 string
                        let base64Image = buffer.toString('base64');
                        let imgSrcString = "data:" + type.mime + ';base64, ' + base64Image;
                        //Resolve base94 string
                        resolve(imgSrcString);
                    });
                })
            });

            promises.push(promise);

        //Return promise array
        Promise.all(promises).then(function(image) {
          var newImage = new Image({
            image: image,
            date: req.body.date,
            password: req.body.password
          })
          newImage.save(function(err, newImage) {
            if(err) throw err;
            res.redirect('/');
          })
        });

})

//post delete flyers
/*
router.post('/delete', function(req, res){

	Image.find({'image' : req.body.base64, 'password'}, function(err, post){
		if(err){
			throw err;
		}
		if(post.password == req.body.password){

		}
	})
})*/


module.exports = router;
