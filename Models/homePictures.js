const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const homePicturesSchema = new Schema({

    urls: [{
        type: String,
        required: true
    }],
});

module.exports = mongoose.model('homePictures', homePicturesSchema);