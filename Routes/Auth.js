const express = require('express')
const routes = express.Router()
const authControllers = require('../Controllers/Auth');
const validate = require('../Validation/Validation')

routes.get('/login', authControllers.getLogin)

routes.post('/login', [validate.email, validate.password] ,authControllers.postLogin)

routes.get('/signup', authControllers.getSignup)

routes.post('/signup', [validate.email, validate.password, validate.confirmPassword] , authControllers.postSignup)

routes.get('/resetPassword', authControllers.getResetPass)

routes.post('/resetPassword', authControllers.postResetPass)

routes.get('/newPassword/:token', authControllers.getNewPass)

routes.post('/newPassword', authControllers.postNewPass)

routes.get('/logout', authControllers.getLogout)

module.exports = routes