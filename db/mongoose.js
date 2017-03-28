const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const env = process.env.NODE_ENV || 'development';

if(env === 'development') {
    process.env.MONGODB_URI = 'mongodb://localhost:27017/shichidaapp';
}

mongoose.connect(process.env.MONGODB_URI);

module.exports = {
    mongoose
}

//asdasdasdasdasdasdasfadf