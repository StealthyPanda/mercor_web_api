
const mongoose = require('mongoose');

const bearerTokenSchema = new mongoose.Schema({
    id : String,
    createdAt: Number,
    token : String,
    organisationId: String,
});

module.exports = mongoose.model('BearerToken', bearerTokenSchema);