const mongoose = require('mongoose');

const MemberSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    address: String,
    phone_number: String
});

const Member = mongoose.model('Member', MemberSchema);

module.exports = Member;
