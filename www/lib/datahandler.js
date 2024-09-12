// This file handles database logic

const loghandler = require('./loghandler');

// Import Sequelize ORM dependencies
const Sequelize = require('sequelize');

// Create sequelize instance
const sequelize = new Sequelize('database', process.env.DATABASE_USERNAME, process.env.DATABASE_PASSWORD, {
    dialect: 'sqlite',
    storage: './www/lib/database/shadowcmsdb.sqlite',
    logging: false
});

// Test database connection
const test_connection = async () => {
    try {
        await sequelize.authenticate();
        loghandler('success', 'Connection has been established successfully.')
    } catch (error) {
        loghandler('error', 'Unable to connect to the database: ' + error)
    }
}

// Models
const User = sequelize.define(
    'users',
    {
        email: {
            type: Sequelize.STRING,
            allowNull: false
        },
        password: {
            type: Sequelize.STRING,
            allowNull: false
        },
        active: {
            type: Sequelize.BOOLEAN,
            defaultValue: true
        },
        admin: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        }
    }
)

// Create Tables
const create_tables = async () => {
    try {
        await sequelize.sync();
        loghandler('success', 'Tables created successfully.')
    } catch (error) {
        loghandler('error', 'Unable to create tables: ' + error)
    }
}

// Check if a user exists
const check_for_user = async () => {
    try {
        const user = await User.findAll();
        if (user.length > 0) {
            return true
        } else {
            return false
        }
    } catch (error) {
        loghandler('error', 'Unable to check for user: ' + error)
    }
}

// Create user
const create_first_user = async (email, password) => {
    try {
        await User.create({
            email: email,
            password: password,
            active: true,
            admin: true
        })
        loghandler('success', 'User created successfully.')
    } catch (error) {
        loghandler('error', 'Unable to create user: ' + error)
    }
}

module.exports = {
    sequelize,
    test_connection,
    create_tables,
    check_for_user,
    create_first_user
}