// Login controller , all function related to login should reside here

const mongoose = require('mongoose');
const { User, Role} = require('../models/users');
const { Department } = require('../models/departments');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');

const connUri = process.env.MONGO_LOCAL_CONN_URL;

module.exports = {
    validate:(method)=>{
        console.log(method.body);
        switch (method) {

            case 'createUser': {
                return [
                    check('name', "userName is required").exists(),
                    check('password', "Password is required").exists(),
                    check('roleId', "Role is required").exists(),
                    check('email', 'Invalid email').exists().isEmail(),
                    check('phone').optional().isInt(),
                    check('status').optional().isIn(['enabled', 'disabled']),
                ];
                break;
            }
            case 'updatePassword':{
                
                return [
                    check('oldPassword', "Old Password is required").exists().isLength({min:1}),
                    check('password', "Password is required").exists().isLength({ min: 1 }),
                    check('confPassword', "Confirm Password is required").exists().isLength({ min: 1 }),
                    check('confPassword', "Confirm password is not same is Password").custom((confPassword,{req,loc,path}) => {
                        if (confPassword !== req.body.password) {
                            // throw error if passwords do not match
                            return false;
                        } else {
                            return true;
                        }
                    })
                ]   
            }
        }
    },
    add: (req, res) => {
        mongoose.connect(connUri, { useNewUrlParser : true }, (err) => {
        let result = {};
        let status = 201;
        if (!err) {
            const { name, password,roleId } = req.body;
            const user = new User({ name, password }); // document = instance of a model
            user.name = name;
            user.password = password;
            user.role = roleId;
            //user.role = `${"5de75b24dfafe09e236354ac"}`;
            //user.role = new mongoose.Types.DBRef("roles", "5de75b24dfafe09e236354ac");
            // TODO: We can hash the password here before we insert instead of in the model
            user.save((err, user) => {
            if (!err) {
                result.status = status;
                result.result = user;
            } else {
                status = 500;
                result.status = status;
                result.error = err;
            }
            res.status(status).send(result);
            });
        } else {
            status = 500;
            result.status = status;
            result.error = err;
            res.status(status).send(result);
        }
        });
    },

    login: (req, res) => {
        const { username, password } = req.body;

        mongoose.connect(connUri, { useNewUrlParser: true }, (err) => {
        let result = {};
        let status = 200;
        if(!err) {
            User.findOne({username:username}, (err, user) => {
            if (!err && user) {
                // We could compare passwords in our model instead of below
                bcrypt.compare(password, user.password).then(match => {
                if (match) {
                    status = 200;
                    // Create a token
                    
                    const payload = { _id: user._id, user: user.username };
                    const options = { expiresIn: process.env.JWT_EXPIRES, issuer: process.env.JWT_ISSUER };
                    const secret = process.env.JWT_SECRET;
                    const token = jwt.sign(payload, secret, options);

                    // console.log('TOKEN', token);
                    result.token = token;
                    result.status = status;
                    user.password="";
                    delete user.password;
                    result.result = user;
                } else {
                    status = 401;
                    result.status = status;
                    result.error = 'Authentication error';
                }
                res.status(status).send(result);
                }).catch(err => {
                status = 500;
                result.status = status;
                result.error = err;
                res.status(status).send(result);
                });
            } else {
                status = 404;
                result.status = status;
                result.error = err;
                res.status(status).send(result);
            }
            });
        } else {
            status = 500;
            result.status = status;
            result.error = err;
            res.status(status).send(result);
        }
        });
    },

    getAll: (req, res) => {
        //mongoose.connect(connUri, { useNewUrlParser: true,useUnifiedTopology: true }, (err) => {
        User.find({}, (err, users) => {
            if (!err) {
            res.send(users);
            } else {
            console.log('Error', err);
            }
        });
        //});
    },
  
    getCurrentUser:(req,res)=>{
        const payload = req.decoded;
        User.findOne({ _id: payload._id }).populate({
            path: 'role',
            model:'Role',
            populate: {
                path: 'department_id',
                model: 'Department'
            }
        }).exec((err, user) => {
            if (!err) {
                //user.role_id.id(Role._id);
                res.send(user);
            } else {
                result={};
                status = 500;
                result.status = status;
                result.error = err;
                res.status(status).send(result);
            }
        });
    },
    updateCurrentUser: (req, res)=>{
        const payload = req.decoded;
        
        var result={};
        if(payload){
            User.findByIdAndUpdate(payload._id, req.body, function (err, updateRes) {

                if (err) {
                    status=401;
                    result.error=err;
                }else if(updateRes !==null){
                    status = 200;
                    result.message = 'User updated successfully';
                }else {
                    console.log(updateRes);
                    status = 404;
                    result.message = 'Unable to update , Please try again later';
                }
                result.status = status;
                res.status(status).send(result);
            });
        }else{
            status = 404;
            result.status=status;
            result.error = 'User not found';
            res.status(status).send(result);
        }
    },
    updatePassword:(req,res)=>{
        const payload = req.decoded;
        var result = {};
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).send({ errors: errors.array(),message : 'Something Went wrong , please try again later' })
        }
        
        let status = 200;
        
        User.findOne({ _id: payload._id }, (err, user) => {
            
            if (!err && user) {
                // We could compare passwords in our model instead of below
                bcrypt.compare(req.body.oldPassword, user.password).then(match => {
                    if (match) {
                        status = 200;
                        
                        user.password = user.generateHash(req.body.password);
                    
                        user.save(function (err) {
                            if (err) {
                                status = 422;
                                result.err = err;
                                result.message = "Something Went wrong , Please try again later!";
                                res.status(status).send(result);
                            }else{
                                result.message = "Password Updated successfuly";
                                user.password = "";
                                delete user.password;
                                result.result = user;
                                res.status(status).send(result);
                            }
                        });
                        
                    } else {
                        status = 422;
                        result.status = status;
                        result.message = "Password dosen't matched";
                        res.status(status).send(result);
                    }
                    //res.status(status).send(result);
                }).catch(err => {
                    status = 500;
                    result.status = status;
                    result.err = err;
                    result.message = "Something Went wrong , Please try again later!";
                    res.status(status).send(result);
                });
            } else {
                status = 422;
                result.status = status;
                result.error = err;
                result.message = "Something Went wrong , Please try again later!";
                res.status(status).send(result);
            }
        });
    },
    checkEmailAvailability:(req,res)=>{
        var result = {};
        var whereClause={};
        if (req.body.email){
            whereClause['email'] = req.body.email;
        }
        
        if (req.body.profileId){
            whereClause['_id'] = { $ne: req.body.profileId };
        }
        
        User.find(whereClause,function (err, users) {
           if(err){
               status = 401;
               result.error = err;
               result.message = 'Something went wrong ,Try again later';
           } else if (users === null) {
               status = 200;
               result.count = 0;
           }else{
               status = 200;
               result.count = users.length;
           } 
            result.status = status;
            res.status(status).send(result);
        });
    }
    

}