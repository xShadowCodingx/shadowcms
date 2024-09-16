// This file handles the routes for /login

const express = require('express');
const router = express.Router();
const loginhandler = require('../lib/loginhandler');
const cms_settings = require('../lib/settings')

router.post('/', async (req, res) => {
    try {
        res.status(200)
        res.redirect('/dashboard')
    } catch (error) {
        res.send("There was an error logging in: " + error)
    }
});

router.post('/first_user', async (req, res) => {
    try {
        await loginhandler.create_first_user(req.body);
        res.status(200)
        res.render('login', { title: cms_settings.title, image_url: cms_settings.logo, image_alt: cms_settings.logo_alt, background_image_url: cms_settings.background_image })
    } catch (error) {
        res.send("There was an error creating the first user: " + error)
    }
});

module.exports = router;