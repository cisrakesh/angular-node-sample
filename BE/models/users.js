const mongoose = require('mongoose');
const mongooseUniqueValidator = require('mongoose-unique-validator');
const bcrypt = require('bcrypt');
//const rolesModel = require('./roles');
const environment = process.env.NODE_ENV;
const stage = require('../config')[environment];

// schema maps to a collection
const Schema = mongoose.Schema;
const roleSchema = new Schema({
    title: {
        type: 'String',
        required: true,
        trim: true,
        unique: true
    },
   // users: [{ type: mongoose.Types.ObjectId, ref: 'User'}]
    department_id: { type: Schema.Types.ObjectId, ref: 'Department', index: true },//roleSchema
});

const userSchema = new Schema({
    username: {
        type: 'String',
        required: true,
        trim: true,
        unique: true
    },
    password: {
        type: 'String',
        required: true,
        trim: true
    },
    name:{
        type: 'String',
        required: true,
        trim: true,
    },
    email: {
        type: 'String',
        required: true,
        trim: true,
        unique: true
    },
    contactNumber: {
        type: 'String',
        required: true,
        trim: true
    },
    gender: {
        type: 'String',
        required: true,
        trim: true
    },
    role: { type: Schema.Types.ObjectId, ref: 'Role', index: true},//roleSchema
});
userSchema.plugin(mongooseUniqueValidator);




// encrypt password before save
userSchema.pre('save', function(next) {
  const user = this;
  if(!user.isModified || !user.isNew) { // don't rehash if it's an old user
    next();
  } else {
    bcrypt.hash(user.password, stage.saltingRounds, function(err, hash) {
      if (err) {
        console.log('Error hashing password for user', user.name);
        next(err);
      } else {
        user.password = hash;
        next();
      }
    });
  }
});

userSchema.methods.generateHash = function (password) {
    return bcrypt.hashSync(password, stage.saltingRounds, null);
};

const RoleModel = mongoose.model('Role', roleSchema);
const UserModel = mongoose.model('User', userSchema);

module.exports = {
    Role: RoleModel,
    User: UserModel
}