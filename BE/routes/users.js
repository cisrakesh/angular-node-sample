const UserController = require('../Controllers/userController');
const validateToken = require('../utils').validateToken;
module.exports = (router) => {
  	router.route('/users')
            .post(UserController.add)
            .get(validateToken, UserController.getAll); // This route will be protected shortly;
        
    router.route('/profile')
        .get(validateToken, UserController.getCurrentUser) 
        .put(validateToken, UserController.updateCurrentUser); 
    router.route('/update-password')
        .put([validateToken, UserController.validate('updatePassword')], UserController.updatePassword); 
    
    router.route('/check-email')
        .post(UserController.checkEmailAvailability);
        
  	router.route('/login')
            .post(UserController.login);
};