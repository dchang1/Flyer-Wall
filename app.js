var express = require('express');
var app = express();
var router = express.Router();
var bodyParser = require('body-parser');
var path = require('path');
var image = require('./routes/image')
var fileUpload = require('express-fileupload');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true, limit: '100mb' }));

app.use(fileUpload());

var exphbs  = require('express-handlebars');
app.use(express.static(path.join(__dirname, 'public')));
app.engine('.hbs', exphbs({ defaultLayout: 'main', extname: '.hbs'}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', '.hbs');

var mongoose = require('mongoose');
var MONGODB_URI = 'mongodb://dchang2:n3w8h5s6@ds125896.mlab.com:25896/flyerwall';
mongoose.connect(MONGODB_URI);

app.use(image);
app.get('/', function(req, res) {
  res.render('index');
})

app.listen(3000, function () {
  console.log('Express listening at', 3000);
  console.log(MONGODB_URI);
});

module.exports = app;
