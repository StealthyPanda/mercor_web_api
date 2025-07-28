
const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    id : String,
    name : String,
    description: String,
    
    status: String,
    employees: Array,

    billable: Boolean,

    //TODO: add payroll thing

    createdAt: Number,
    organisationId: String,
    projectId: String,
});

module.exports = mongoose.model('Task', taskSchema);