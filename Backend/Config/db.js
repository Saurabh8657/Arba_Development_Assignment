const mongoose = require('mongoose')
require('dotenv').config()

const connection = mongoose.connect(process.env.mongoURL)

const secretKey = process.env.secretKey

module.exports = {
    connection,
    secretKey
}