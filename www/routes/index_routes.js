// This file handles the routes for /

const express = require('express');
const router = express.Router();
const cms_settings = require('../lib/settings');
const datahandler = require('../lib/datahandler');

const isAuth = (req, res, next) => {
    if (req.session.isAuth) {
        next();
    } else {
        res.redirect('/login');
    }
}

const bypassLogin = (req, res, next) => {
    if (!req.session.isAuth) {
        next();
    } else {
        res.redirect('/dashboard');
    }
}

router.get('/', bypassLogin, async (req, res) => {
    res.status(200);
    await datahandler.check_for_user().then(result => {
        if (result === false) {
            res.render('create_first_user', {title: cms_settings.title, image_url: cms_settings.logo, image_alt: cms_settings.logo_alt, background_image_url: cms_settings.background_image});
        } else {
            res.render('login', {title: cms_settings.title, image_url: cms_settings.logo, image_alt: cms_settings.logo_alt, background_image_url: cms_settings.background_image});
        }
    })
});

router.get('/dashboard', isAuth, (req, res) => {
    res.status(200);
    res.render('dashboard', {title: cms_settings.title, image_url: cms_settings.logo, image_alt: cms_settings.logo_alt, background_image_url: cms_settings.background_image, admin: req.session.isAdmin});
});

module.exports = router;