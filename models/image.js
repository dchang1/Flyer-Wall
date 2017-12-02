var mongoose = require('mongoose');

var imageSchema = new mongoose.Schema({
  image: {type: String},
  date: {type: String},
  password: {type: String}
});


// Export schema =====================================================================================================================================================================
module.exports = mongoose.model('Image', imageSchema);
