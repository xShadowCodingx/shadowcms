// This file handles the routes for /admin

const express = require('express');
const router = express.Router();

const datahandler = require('../lib/datahandler')
const cms_settings = require('../lib/settings');
const message_handler = require('../lib/messagehandler');

const isAdminAuth = (req, res, next) => {
    if (req.session.isAuth) {
        if (req.session.isAdmin === true) {
            next();
        } else {
            res.status(401)
            res.send("<h1>401 Unauthorized</h1>")
        }
    } else {
        res.redirect('/login');
    }
}

router.get('/categories', isAdminAuth, async (req, res) => {
    try {
        const tables = await datahandler.get_table_names();
        let columns = []
        let table_names = []
        for await (i of tables) {
            table_names.push(i.name)
            let cols = await datahandler.get_column_names(i.name)
            columns.push(cols)
        }
        res.render('schema', { title: cms_settings.title, image_url: cms_settings.logo, image_alt: cms_settings.logo_alt, background_image_url: cms_settings.background_image, tables: table_names, columns: columns })
    } catch (error) {
        res.send("There was an error logging in: " + error)
    }
});

router.get('/create-category', isAdminAuth, async (req, res) => {
    const references = await datahandler.get_table_names()
    res.render('new_category', { title: cms_settings.title, image_url: cms_settings.logo, image_alt: cms_settings.logo_alt, background_image_url: cms_settings.background_image, references: references })
});

router.post('/create-category', isAdminAuth, async (req, res) => {
    try {
        const new_category = await datahandler.create_table(req.body)
        res.redirect('/admin/create-category')
    } catch (error) {
        res.send("There was an error creating the category: " + error)
    }
});

router.get('/delete-category', isAdminAuth, async (req, res) => {
    try {
        const deleted_category = await datahandler.delete_table(req.query.table)
        res.redirect('/admin/categories')
    } catch (error) {
        res.send("There was an error deleting the category: " + error)
    }
});

router.get('/api-keys', isAdminAuth, async (req, res) => {
    let raw_categories = await datahandler.get_table_names()
    let categories = raw_categories.filter(x => x.name !== 'users' && x.name !== 'api_keys')
    let api_keys = await datahandler.get_api_keys()
    let give_alert = message_handler(req.query.alert)
    console.log(api_keys)
    res.render('api_keys', { title: cms_settings.title, image_url: cms_settings.logo, image_alt: cms_settings.logo_alt, background_image_url: cms_settings.background_image, api_keys: api_keys, categories: categories, give_alert: give_alert })
});

router.post('/api-keys', isAdminAuth, async (req, res) => {
    try {
        const api_key = await datahandler.create_api_key(req.body)
        res.redirect('/admin/api-keys?alert=key_created')
    } catch (error) {
        res.send("There was an error creating the API key: " + error)
    }
})

router.post('/api-key-categories', isAdminAuth, async (req, res) => {
    const categories = await datahandler.assign_api_key_categories(req.query.key, Object.keys(req.body))
    res.redirect('/admin/api-keys')
})

router.get('/delete-api-key', isAdminAuth, async (req, res) => {
    const api_key = await datahandler.delete_api_key(req.query.key)
    res.redirect('/admin/api-keys')
})

router.get('/users', isAdminAuth, async (req, res) => {
    const active_users = await datahandler.get_active_users()
    const inactive_users = await datahandler.get_inactive_users()
    res.render('users', { title: cms_settings.title, image_url: cms_settings.logo, image_alt: cms_settings.logo_alt, background_image_url: cms_settings.background_image, users: active_users, inactive_users: inactive_users })
})

router.post('/users', isAdminAuth, async (req, res) => {
    const user = await datahandler.create_user(req.body)
    res.redirect('/admin/users')
})

router.get('/delete-user', isAdminAuth, async (req, res) => {
    const deleted_user = await datahandler.delete_user_by_id(req.query.user)
    res.redirect("/admin/users")
})

router.get('/deactivate-user', isAdminAuth, async (req, res) => {
    const deactivated_user = await datahandler.deactivate_user_by_id(req.query.user)
    res.redirect("/admin/users")
})

router.get('/reactivate-user', isAdminAuth, async (req, res) => {
    const reactivated_user = await datahandler.reactivate_user_by_id(req.query.user)
    res.redirect("/admin/users")
})

module.exports = router;