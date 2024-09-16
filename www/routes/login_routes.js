// This file handles the routes for /login

const express = require('express');
const router = express.Router();
const loginhandler = require('../lib/loginhandler');
const cms_settings = require('../lib/settings');

const isAuth = (req, res, next) => {
    if (!req.session.isAuth) {
        next();
    } else {
        res.redirect('/dashboard');
    }
}

router.post('/', async (req, res) => {
    try {
        const result = await loginhandler.login_user(req.body)
        if (result != undefined) {
            if (result.found === true) {
                req.session.isAuth = true;
                res.status(200)
                res.redirect('/dashboard')
            } else {
                res.render('login', { title: cms_settings.title, image_url: cms_settings.logo, image_alt: cms_settings.logo_alt, background_image_url: cms_settings.background_image, message_type: result.type, message: result.message })
            }
        } else {
            console.log(result)
            res.render('login', { title: cms_settings.title, image_url: cms_settings.logo, image_alt: cms_settings.logo_alt, background_image_url: cms_settings.background_image, message_type: 'error', message: "An error has occurred. If this continues please contact your administrator." })
        }
    } catch (error) {
        res.send("There was an error logging in: " + error)
    }
});

router.get('/' , isAuth, (req, res) => {
    res.render('login', { title: cms_settings.title, image_url: cms_settings.logo, image_alt: cms_settings.logo_alt, background_image_url: cms_settings.background_image })
})

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