var mongoose = require('mongoose');

var imageSchema = new mongoose.Schema({
  image: {type: String},
  date: {type: Date},
  password: {type: String},
  width: {type: Number},
  height: {type: Number}
});


// Export schema =====================================================================================================================================================================
module.exports = mongoose.model('Image', imageSchema);
