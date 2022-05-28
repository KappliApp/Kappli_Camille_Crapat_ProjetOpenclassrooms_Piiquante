const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const usersSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true }, // 1 seul fois le même mail possible
    password: { type: String, required: true },
});

usersSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Users', usersSchema);