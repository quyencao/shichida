const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const env = process.env.NODE_ENV || 'development';

if(env === 'development') {
    process.env.MONGODB_URI = 'mongodb://localhost:27017/shichidaapp';
}

mongoose.connect('mongodb://quyen:asdasdasdasdasdasdasfadf@ds143030.mlab.com:43030/shichidaapp');

module.exports = {
    mongoose
}

//asdasdasdasdasdasdasfadf

