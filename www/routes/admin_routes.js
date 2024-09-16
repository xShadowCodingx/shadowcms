// This file handles the routes for /admin

const express = require('express');
const router = express.Router();

const datahandler = require('../lib/datahandler')
const cms_settings = require('../lib/settings')

const isAdminAuth = (req, res, next) => {
    if (req.session.isAuth) {
        if(req.session.isAdmin === true){
            next();
        } else {
            res.status(401)
            res.send("<h1>401 Unauthorized</h1>")
        }
    } else {
        res.redirect('/login');
    }
}

router.get('/schema', isAdminAuth, async (req, res) => {
    try {
        res.render('schema', { title: cms_settings.title, image_url: cms_settings.logo, image_alt: cms_settings.logo_alt, background_image_url: cms_settings.background_image })
    } catch (error) {
        res.send("There was an error logging in: " + error)
    }
});

module.exports = router;