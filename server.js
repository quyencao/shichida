const express = require('express');
const bodyParser = require('body-parser');
const {mongoose} = require('./db/mongoose');
const {User} = require('./models/user');
const _  = require('lodash');
const cors = require('cors');
const {authenticate} = require('./middleware/authenticate');

const app = express();
app.use(bodyParser.json());
// app.use(cors());

const { Sight, Phonic1 } = require('./data/index');
const port = process.env.PORT || 8080;

app.get('/sight/:id', (req, res) => {
    var id = req.params.id;
    res.send({
        data: Sight[`SIGHT_WORDS_${id}`]
    });
});

app.get('/phonic1/:id', authenticate, (req, res) => {
    var id = req.params.id;

    res.send({
        data: Phonic1[`WORDS_BEGINNING_WITH_${id}`]
    });
});

app.post('/users/signup', (req, res) => {
    const body = _.pick(req.body, [
        'name', 'age', 'email', 'password', 'phoneNumber', 'location'
    ]);

    var newUser = new User(body);
    newUser.save().then(() => {
        return newUser.generateToken();
    }).then((token) => {
        res.send({user: newUser});
    }).catch((err) => {
        res.status(400).send("hello");
    });
});


app.post('/users/login', (req, res) => {
    const body = _.pick(req.body, ['email', 'password']);

    User.findCredentials(body.email, body.password).then((user) => {
        user.generateToken().then((token) => {
            res.send({user});
        });
    }).catch((err) => {
        res.status(404).send();
    });
});

app.post('/users/email', (req, res) => {
    const body = _.pick(req.body, ['email']);

    User.findEmail(body.email).then((user) => {
        if(!user) {
            return Promise.reject();
        }

        res.send({
            valid: false
        });
    }).catch((err) => {
        res.send({
           valid: true
        });
    });
});

app.delete('/users/logout', authenticate, (req, res) => {
    req.user.removeToken(req.user.token).then(() => {
        res.send();
    }).catch((err) => {
        res.status(400).send();
    });
});

app.listen(port, () => {
   console.log(`Server is up on port 8080`);
});