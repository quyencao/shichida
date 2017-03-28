const _ = require('lodash');
const {User} = require('./../models/user');

var authenticate = (req, res, next) => {
    const token = req.header('token');

    User.findByToken(token).then((user) => {
        if(!user) {
            return Promise.reject();
        }

        req.user = user;
        next();
    }).catch((err) => {
        res.status(400).send();
    });
};

module.exports = {authenticate};