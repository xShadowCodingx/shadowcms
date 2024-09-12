// This file handles the routes for /login

const express = require('express');
const router = express.Router();
const loginhandler = require('../lib/loginhandler');

router.post('/', (req, res) => {
    res.status(200);
    res.redirect('/dashboard')
});

router.post('/first_user', (req, res) => {
    loginhandler.create_first_user(req.body);
    res.send("Hi")
});

module.exports = router;