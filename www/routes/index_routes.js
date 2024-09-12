// This file handles the routes for /

const express = require('express');
const router = express.Router();
const cms_settings = require('../lib/settings');
const datahandler = require('../lib/datahandler');

router.get('/', async (req, res) => {
    res.status(200);
    await datahandler.check_for_user().then(result => {
        if (result === false) {
            res.render('create_first_user', {title: cms_settings.title, image_url: cms_settings.logo, image_alt: cms_settings.logo_alt, background_image_url: cms_settings.background_image});
        } else {
            res.render('login', {title: cms_settings.title, image_url: cms_settings.logo, image_alt: cms_settings.logo_alt, background_image_url: cms_settings.background_image});
        }
    })
});

router.get('/dashboard', (req, res) => {
    res.status(200);
    res.render('dashboard');
});

module.exports = router;