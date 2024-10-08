// This file handles database logic

const { v4: uuidv4 } = require('uuid');

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
        },
        temporaryPassword: {
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
        },
        categories: {
            type: Sequelize.JSON,
            allowNull: true
        }
    }
)

const Projects = sequelize.define(
    'projects',
    {
        name: {
            type: Sequelize.STRING,
            allowNull: false
        },
        cors: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        cors_url: {
            type: Sequelize.STRING,
            allowNull: true
        },
        api_key: {
            type: Sequelize.STRING,
            allowNull: true
        },
        description: {
            type: Sequelize.BLOB,
            allowNull: true
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
        const pw = hashing.hash_password(password)
        await User.create({
            email: email,
            password: pw,
            active: true,
            admin: true
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

const delete_table = async (table) => {
    const dropped_table = await sequelize.query('DROP TABLE ' + table)
    loghandler('info', 'Dropped table: ' + table)
    return messagehandler('table_deleted')
}

const get_api_keys = async () => {
    const api_keys = await API_Keys.findAll()
    return api_keys
}

const create_api_key = async (api_key) => {
    var key = uuidv4()
    var name = api_key.name
    key = key.replace(/-/g, "")
    name = name.replace(/[^a-zA-Z0-9_\s]/g, '')
    name = name.replace(/\s/g, "_")
    if (!/[a-zA-Z]/.test(name[0])) {
        name = "_" + name.slice(1);
    }
    
    let new_key = await API_Keys.create({
        name: name,
        key: key
    })
    return messagehandler('key_created')
}

const delete_api_key = async (api_key) => {
    const key = await API_Keys.findOne({ where: { key: api_key } })
    await key.destroy()
    return messagehandler('key_deleted')
}

const assign_api_key_categories = async (api_key, categories) => {
    const key = await API_Keys.findOne({ where: { key: api_key } })
    const categories_assigned = await key.update({ categories: categories })
    return messagehandler('key_categories_assigned')
}

const get_users = async () => {
    const users = await User.findAll()
    return users
}

const create_user = async (user) => {
    try {
        let result = await User.findOne({where: {email: user.Email}})
        if(result) {
            return messagehandler('user_already_exists')
        } else {
            let password = hashing.hash_password(user.TemporaryPassword)
            if (user.Admin) {
                let new_user = await User.create({
                    email: user.Email,
                    password: password,
                    admin: true,
                    temporaryPassword: true
                })
                loghandler('success', 'User (Admin) created successfully.')
                return messagehandler('user_created')
            } else {
                let new_user = await User.create({
                    email: user.Email,
                    password: password,
                    admin: false,
                    temporaryPassword: true
                })
                loghandler('success', 'User created successfully.')
                return messagehandler('user_created')
            }
        }
    } catch (error) {
        loghandler('error', 'Unable to see if user exists: ' + error)
    }
}

const get_user_by_id = async (id) => {
    const user = await User.findOne({ where: { id: id } })
    return user
}

const delete_user_by_id = async (id) => {
    const user = await get_user_by_id(id)
    const deleted_user = await user.destroy()
    loghandler('success', 'User deleted successfully.')
    return messagehandler('user_deleted')
}

const deactivate_user_by_id = async (id) => {
    const user = await get_user_by_id(id)
    const deactivated_user = await user.update({ active: false })
    loghandler('success', 'User deactivated successfully.')
    return messagehandler('user_deactivated')
}

const reactivate_user_by_id = async (id) => {
    const user = await get_user_by_id(id)
    const reactivated_user = await user.update({ active: true })
    loghandler('success', 'User reactivated successfully.')
    return messagehandler('user_reactivated')
}

const get_active_users = async () => {
    const users = await User.findAll({ where: { active: true } })
    return users
}

const get_inactive_users = async () => {
    const users = await User.findAll({ where: { active: false } })
    return users
}

const check_if_active = async (id) => {
    const user = await get_user_by_id(id)
    if (user.active) {
        return true
    } else {
        return false
    }
}

const create_project = async (project) => {
    try {
        let api_key = null
        let cors = false
        let cors_url = null
        if(project.APIKeySelection !== "no") {
            api_key = project.APIKeySelection
        }
        if(project.CORSSelect == "yes") {
            cors = true
            cors_url = project.CORSUrl
        }
        let new_project = await Projects.create({
            name: project.name,
            description: project.description,
            api_key: api_key,
            cors: cors,
            cors_url: cors_url
        })
    } catch (error) {
        loghandler('error', 'Unable to see if project exists: ' + error)
    }
}

const get_projects = async () => {
    const projects = await Projects.findAll()
    return projects
}

const get_project_by_id = async (id) => {
    const project = await Projects.findOne({ where: { id: id } })
    return project
}

const delete_project = async (project) => {
    const deleted_project = await project.destroy()
    loghandler('success', 'Project deleted successfully.')
    return messagehandler('project_deleted')
}

const edit_project = async (project) => {
    try {
        let current_project = await Projects.findOne({ where: { id: project.id } })
        let api_key = null
        let cors = false
        let cors_url = null
        if(project.APIKeySelection !== "no") {
            api_key = project.APIKeySelection
        }
        if(project.CORSSelect == "yes") {
            cors = true
            cors_url = project.CORSUrl
        }
        current_project.api_key = api_key
        current_project.cors = cors
        current_project.cors_url = cors_url
        current_project.description = project.description
        await current_project.save()
        return messagehandler('project_edited')
    } catch (error) {
        loghandler('error', 'Unable to update project: ' + error)
    }
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
    delete_table,
    get_api_keys,
    create_api_key,
    delete_api_key,
    assign_api_key_categories,
    get_users,
    create_user,
    get_user_by_id,
    delete_user_by_id,
    deactivate_user_by_id,
    get_active_users,
    get_inactive_users,
    check_if_active,
    reactivate_user_by_id,
    create_project,
    get_projects,
    get_project_by_id,
    delete_project,
    edit_project
}