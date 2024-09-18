// This file handles database logic

const loghandler = require('./loghandler');
const hashing = require('./hashing');
const messagehandler = require('./messagehandler');

// Import Sequelize ORM dependencies
const Sequelize = require('sequelize');
const Model = require('sequelize').Model

// Create sequelize instance
const sequelize = new Sequelize('database', process.env.DATABASE_USERNAME, process.env.DATABASE_PASSWORD, {
    dialect: 'sqlite',
    define: {
        freezeTableName: true
    },
    storage: './www/lib/database/shadowcmsdb.sqlite',
    logging: false,
});

// Test database connection
const test_connection = async () => {
    try {
        await sequelize.authenticate();
        loghandler('success', 'Connection to database has been established successfully.')
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

const API_Keys = sequelize.define(
    'api_keys',
    {
        name: {
            type: Sequelize.STRING,
            allowNull: false
        },
        key: {
            type: Sequelize.STRING,
            allowNull: false
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

// Check if a user exists at all
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
        await hashing.hash_password(password).then(async (pw) => {
            await User.create({
                email: email,
                password: pw,
                active: true,
                admin: true
            })
        })
        loghandler('success', 'User created successfully.')
    } catch (error) {
        loghandler('error', 'Unable to create user: ' + error)
    }
}

// Check for user
const check_email = async (user) => {
    try {
        const result = await User.findOne({ where: { email: user.Email } })
        if (result) {
            if (await hashing.check_hash(user.Password, result.password)) {
                return { found: true, user: result }
            } else {
                return messagehandler('incorrect_login')
            }
        } else {
            return messagehandler('incorrect_login')
        }
    } catch (error) {
        loghandler('error', 'Unable to see if user exists: ' + error)
    }
}

const get_table_names = async () => {
    const tables = await sequelize.showAllSchemas();
    return tables
}

const get_column_names = async (table) => {
    let columns = await sequelize.query(`SELECT * FROM PRAGMA_TABLE_INFO('${table}')`)
    return columns
}

const create_table = async (table) => {
    const keys = Object.getOwnPropertyNames(table)
    new_table = {}
    new_table.fields = {}
    for (i = 0; i < keys.length; i++) {
        if (i === 0) {
            var original_string = eval('table.' + keys[i])
            var no_special_chars = original_string.replace(/[^a-zA-Z0-9_\s]/g, '')
            var removed_spaces = no_special_chars.replace(/\s/g, "_")
            if (!/[a-zA-Z]/.test(removed_spaces[0])) {
                removed_spaces = "_" + removed_spaces.slice(1);
            }
            new_table.name = removed_spaces
        } else {
            var original_string = eval('table.' + keys[i])
            var no_special_chars = original_string.replace(/[^a-zA-Z0-9_\s]/g, '')
            var removed_spaces = no_special_chars.replace(/\s/g, "_")
            if (!/[a-zA-Z]/.test(removed_spaces[0])) {
                removed_spaces = "_" + removed_spaces.slice(1);
            }
            eval('new_table.fields.' + removed_spaces + "= {}");
            i++
            switch (eval('table.' + keys[i])) {
                case "short_text":
                    eval('new_table.fields.' + removed_spaces + ".type = " + "Sequelize.STRING");
                    eval('new_table.fields.' + removed_spaces + ".allowNull = true");
                    break;
                case "long_text":
                    eval('new_table.fields.' + removed_spaces + ".type = " + "Sequelize.BLOB");
                    eval('new_table.fields.' + removed_spaces + ".allowNull = true");
                    break;
                case "date":
                    eval('new_table.fields.' + removed_spaces + ".type = " + "Sequelize.DATE");
                    eval('new_table.fields.' + removed_spaces + ".allowNull = true");
                    break;
                case "reference":
                    eval('new_table.fields.' + removed_spaces + ".type = " + "Sequelize.BOOLEAN");
                    eval('new_table.fields.' + removed_spaces + ".allowNull = true");
                    eval('new_table.fields.reference_from_' + removed_spaces + " = {}");
                    eval('new_table.fields.reference_from_' + removed_spaces + ".type = " + "Sequelize.STRING");
                    eval('new_table.fields.reference_from_' + removed_spaces + ".allowNull = true");
                    break;
                case 'image':
                    eval('new_table.fields.' + removed_spaces + ".type = " + "Sequelize.STRING");
                    eval('new_table.fields.' + removed_spaces + ".allowNull = true");
                    break;

            }
        }
    }
    eval('let ' + new_table.name + ' = ' + sequelize.define(new_table.name, new_table.fields));
    await sequelize.sync()
    loghandler('info', 'Created table: ' + new_table.name)
    return messagehandler('table_created')
}

const delete_table = async(table) => {
    const dropped_table = await sequelize.query('DROP TABLE ' + table)
    await sequelize.sync()
    loghandler('info', 'Dropped table: ' + table)
    return messagehandler('table_deleted')
}

module.exports = {
    sequelize,
    test_connection,
    create_tables,
    check_for_user,
    create_first_user,
    check_email,
    create_table,
    Sequelize,
    get_table_names,
    get_column_names,
    delete_table
}