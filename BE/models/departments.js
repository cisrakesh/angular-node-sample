const mongoose = require('mongoose');
const mongooseUniqueValidator = require('mongoose-unique-validator');
const bcrypt = require('bcrypt');
//const rolesModel = require('./roles');
const environment = process.env.NODE_ENV;
const stage = require('../config')[environment];
// schema maps to a collection
const Schema = mongoose.Schema;
const departmentSchema = new Schema({
    title: {
        type: 'String',
        required: true,
        trim: true,
        unique: true
    },
    // users: [{ type: mongoose.Types.ObjectId, ref: 'User'}]

});

departmentSchema.plugin(mongooseUniqueValidator);
const DepartmentModel = mongoose.model('Department', departmentSchema);
module.exports = {
    Department: DepartmentModel,
}