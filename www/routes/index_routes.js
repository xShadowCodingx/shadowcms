// This file handles the routes for /

const express = require('express');
const router = express.Router();
const cms_settings = require('../lib/settings');

router.get('/', (req, res) => {
    res.status(200);
    res.render('login', {title: cms_settings.title, image_url: cms_settings.logo, image_alt: cms_settings.logo_alt, background_image_url: cms_settings.background_image});
});

module.exports = router;