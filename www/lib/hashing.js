// This file handles hashing and checking passwords

const bcrypt = require('bcryptjs');

const hash_password = (password) => {
    const saltRounds = 10;
    const hash = bcrypt.hashSync(password, saltRounds);
    return hash
}

const check_hash = async (password, hash) => {
    const match = bcrypt.compareSync(password, hash)
    return match
}

module.exports = {
    hash_password,
    check_hash
}