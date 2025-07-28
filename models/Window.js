
const mongoose = require('mongoose');

const windowSchema = new mongoose.Schema({
    id : String,
    token : String,

    //TODO: This; its supposed to be a WindowType type.
    type: String,
    
    start : Number,
    end : Number,
    timezoneOffset : Number,
    startTranslated : Number,
    endTranslated : Number,
    negativeTime : Number,

    shiftId : String,
    projectId : String,
    taskId : String,
    organisationId : String,

    taskStatus: String,
    taskPriority: String,

    paid : Boolean,
    billable: Boolean,
    overtime : Boolean,

    billRate : Number,
    overtimeBillRate : Number,
    payRate : Number,
    overtimePayRate : Number,

    note : String,
    name : String,
    user : String,
    domain : String,
    computer : String,
    hwid : String,
    os : String,
    osVersion : String,
    employeeId : String,
    teamId : String,
    
    deletedScreenshots : Number,

    createdAt: Number,
    updatedAt: Number,
});

module.exports = mongoose.model('Window', windowSchema);