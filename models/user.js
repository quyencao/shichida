const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

var UserSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: 1,
        trim: true,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    email: {
        type: String,
        minlength: 6,
        trim: true,
        required: true,
        unique: true,
        validate: {
            validator: validator.isEmail,
            message: '{VALUE} is not valid email'
        }
    },
    password: {
        type: String,
        minlength: 6,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    token: {
        type: String,
        default: null
    }

});

UserSchema.methods.toJSON = function () {
    var user = this;

    return _.pick(user.toObject(), ['email', 'name', 'age', 'phoneNumber', 'location', 'token' +
    ''])
};

UserSchema.methods.generateToken = function () {
    var user = this;

    var token = jwt.sign({
        _id: user._id.toHexString()
    }, 'abc123').toString();

    user.token = token;

    return user.save().then(() => {
        return token;
    });
};

UserSchema.methods.removeToken = function (token) {
    var user = this;

    return user.update({
       $set: {
           token: null
       }
    });
};

UserSchema.pre('save', function (next) {
    var user = this;

    if(user.isModified('password')) {
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(user.password, salt, (err, hash) => {
                user.password = hash;

                next();
            });
        });
    } else {
        next();
    }
});

UserSchema.statics.findByToken = function (token) {
    var User = this;
    var decodedToken = null;

    try {
        decodedToken = jwt.verify(token, 'abc123');
    }
    catch (e) {
        return Promise.reject();
    }

    return User.findOne({_id: decodedToken._id, token});
};

UserSchema.statics.findEmail = function (email) {
    var User = this;

    return User.findOne({email});
};

UserSchema.statics.findCredentials = function (email, password) {
    var User = this;

    return User.findOne({email}).then((user) => {
        if(!user) {
            return Promise.reject();
        }

        return new Promise((resolve, reject)  => {
            bcrypt.compare(password, user.password, (err, res) => {
                if(res) {
                    resolve(user);
                } else {
                    reject(user);
                }
            });
        });
    });
};

var User = mongoose.model('User', UserSchema);

module.exports = { User };