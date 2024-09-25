// This file handles the routes for /

const express = require('express');
const router = express.Router();
const cms_settings = require('../lib/settings');
const datahandler = require('../lib/datahandler');
const messagehandler = require('../lib/messagehandler');

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

router.get('/dashboard', isAuth, async (req, res) => {
    res.status(200);
    res.render('dashboard', {title: cms_settings.title, image_url: cms_settings.logo, image_alt: cms_settings.logo_alt, background_image_url: cms_settings.background_image, admin: req.session.isAdmin});
});

router.get('/create-content', isAuth, async (req, res) => {
    res.status(200);
    res.render('create_content', {title: cms_settings.title, image_url: cms_settings.logo, image_alt: cms_settings.logo_alt, background_image_url: cms_settings.background_image, admin: req.session.isAdmin});
});

router.get('/create-project', isAuth, async (req, res) => {
    res.status(200);
    const api_keys = await datahandler.get_api_keys();
    const alert = messagehandler(req.query.alert)
    res.render('create_project', {title: cms_settings.title, image_url: cms_settings.logo, image_alt: cms_settings.logo_alt, background_image_url: cms_settings.background_image, admin: req.session.isAdmin, api_keys: api_keys, give_alert: alert});
});

router.post('/create-project', isAuth, async (req, res) => {
    res.status(200);
    const project = await datahandler.create_project(req.body);
    res.redirect('/create-project?alert=project_created');
})

router.get('/view-content', isAuth, async (req, res) => {
    res.status(200);
    res.render('view_content', {title: cms_settings.title, image_url: cms_settings.logo, image_alt: cms_settings.logo_alt, background_image_url: cms_settings.background_image, admin: req.session.isAdmin});
});

router.get('/view-projects', isAuth, async (req, res) => {
    res.status(200);
    const projects = await datahandler.get_projects();
    const api_keys = await datahandler.get_api_keys();
    const alert = messagehandler(req.query.alert)
    res.render('view_projects', {title: cms_settings.title, image_url: cms_settings.logo, image_alt: cms_settings.logo_alt, background_image_url: cms_settings.background_image, admin: req.session.isAdmin, projects: projects, give_alert: alert, api_keys: api_keys});
});

router.get('/delete-project', isAuth, async (req, res) => {
    res.status(200);
    const project = await datahandler.get_project_by_id(req.query.project);
    const deleted_project = await datahandler.delete_project(project);
    res.redirect('/view-projects?alert=project_deleted');
});

router.post('/edit-project', isAuth, async (req, res) => {
    res.status(200);
    const edited_project = await datahandler.edit_project(req.body);
    res.redirect('/view-projects?alert=project_edited');
});

module.exports = router;