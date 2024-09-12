// This is the main entry point for the CMS

const express = require('express');
require('dotenv').config();
const settingshandler = require('./www/lib/settingshandler');
const conditional_handler = require('./www/lib/index_conditionals')

const app = express();

// Set View Engine
app.set('view engine', 'pug');
app.set('views', './www/routes/views');

// Set public directories (static files)
app.use(express.static('./www/public'));

// Route imports
const index_routes = require('./www/routes/index_routes')

// Route declarations
app.use('/', index_routes);

app.listen(settingshandler.port, (error) => { conditional_handler.app_listener(error, settingshandler.port); });