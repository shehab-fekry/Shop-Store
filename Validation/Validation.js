const { check, body } = require('express-validator/check');

exports.email = body('email', 'Please enter a valid email')
    .notEmpty()
    .isEmail()
    .normalizeEmail()
    .trim()

exports.password = body('password',)
    .notEmpty()
    .withMessage('Please enter a valid password')
    .isAlphanumeric()
    .withMessage('Password should consist of characters and numbers with no special characters')
    .isLength({min: 5, max: 15})
    .withMessage('Password should be between 5 and 15 characters')
    .trim()

exports.confirmPassword = body('confirmPassword', 'Passwords have to match!')
    .custom((value, {req}) => {
        if(value !== req.body.password){
            return false
        }
        return true
    })
    .trim()
