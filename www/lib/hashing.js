// This file handles hashing and checking passwords

const bcrypt = require('bcryptjs');

const hash_password = async (password) => {
    const salt = bcrypt.genSaltSync(10);
    const pw = bcrypt.hashSync(password, salt)
    return pw
}

const check_hash = async (password, hash) => {
    const match = bcrypt.compareSync(password, hash)
    return match
}

module.exports = {
    hash_password,
    check_hash
}