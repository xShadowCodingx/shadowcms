// This is the main entry point for the CMS

const express = require('express');
var bodyParser = require('body-parser');
require('dotenv').config();
const settingshandler = require('./www/lib/settingshandler');
const conditional_handler = require('./www/lib/index_conditionals');
const datahandler = require('./www/lib/datahandler');

const app = express();
const session = require('express-session');
const sqlite = require('better-sqlite3');

const SqliteStore = require('better-sqlite3-session-store')(session);
const db = new sqlite('sessions.db');

// Set body parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Set session information in middleware
app.use(session({
    secret: process.env.SESSION_SIGNATURE_SECRET_KEY,
    resave: false,
    saveUninitialized: true,
    store: new SqliteStore({
        client: db,
        expired: {
            clear: true,
            intervalMs: process.env.SESSION_TIMEOUT_MS
        }
    })
}));

// Prep database
datahandler.sequelize
datahandler.test_connection()
datahandler.create_tables()

// Set View Engine
app.set('view engine', 'pug');
app.set('views', './www/routes/views');

// Set public directories (static files)
app.use(express.static('./www/public'));

// Route imports
const index_routes = require('./www/routes/index_routes')
const login_routes = require('./www/routes/login_routes')

// Route declarations
app.use('/', index_routes);
app.use('/login', login_routes);

app.listen(settingshandler.port, (error) => { conditional_handler.app_listener(error, settingshandler.port); });