
const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
    id : String,
    name : String,
    email : String,
    password : String,
    teamId: String,
    sharedSettingsId: String,
    accountId: String,
    identifier: String,
    type: String,
    organisationId: String,
    projects: Array,
    deactivated: Number,
    invited: Number,
    createdAt: Number
});

module.exports = mongoose.model('Employee', employeeSchema);