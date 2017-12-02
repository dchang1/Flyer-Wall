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
    console.log(images);
    if(images!=[]) {
      var data=[]
      for(var i=0; i<images.length; i++) {
      	data.push(images[i].image);
      }
      res.render('index', {images: data});
    } else {
      res.render('index');
    }
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
                image.getBuffer(type.mime, (err, buffer)=>{
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

//clicking the x button to delete
router.post('/xbutton', function(req, res){
	var message = encodeURIComponent(req.body.base64);
	res.redirect('/delete/?base64=' + message);
})

//post delete flyers
router.post('/delete', function(req, res){

	Image.remove({'image' : req.body.base64, 'password' : req.body.password}, function(err){
		if(err){
			var message = encodeURIComponent(req.body.base64)
			res.redirect('/delete/?base64=' + message + '&error=' + 'error')
		} else {
			res.redirect('/');
		}
	})
})

//loading up the delete page
router.get('/delete', function(req, res){
	res.render('delete', {image: req.query.base64, error: req.query.error})
})


module.exports = router;
