
const mongoose = require('mongoose');

const organisationSchema = new mongoose.Schema({
    id : String,
    createdAt: Number,
    name : String,
    employees: Array,
    projects: Array,
});

module.exports = mongoose.model('Organisation', organisationSchema);