
const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    id : String,
    name : String,
    description: String,
    statuses: Array,
    priorities: Array,
    employees: Array,

    billable: Boolean,
    deadline : Number,

    //TODO: add payroll thing

    createdAt: Number,
    organisationId: String,
});

module.exports = mongoose.model('Project', projectSchema);