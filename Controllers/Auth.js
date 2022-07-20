const User = require('../Models/UserM');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');
const { validationResult } = require('express-validator/check')

let transport = nodemailer.createTransport(sendgridTransport({
    auth: {
        api_key: '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',
    }
}))

exports.getLogin = (req, res, next) => {
    // console.log('session: ', req.session)
    let errorMessage = req.flash('errorLogin')[0];
    res.render('auth/login', {
        path: '/login',
        pageTitle: 'login',
        isAuthenticated: false,
        errorMessage: errorMessage,
        errors: [],
        oldInputs: {
            email: '',
            password: '',
        }
    })
}

exports.postLogin = (req, res, next) => {
    const {email, password} = req.body;
    const errors = validationResult(req).errors;

    if(errors.length !== 0){
        return res.render('auth/login', {
            path: '/login',
            pageTitle: 'login',
            isAuthenticated: false,
            errorMessage: errors[0].msg,
            errors: errors.array(),
            oldInputs: {
                email: email,
                password: password,
            }
        })
    }

    User.findOne({email: email})
    .then(user => {
        if(user) {
            bcrypt.compare(password, user.password)
            .then(doMatch => {
                if(!doMatch){
                    req.flash('errorLogin', 'Wrong Password')
                    return res.redirect('/login')
                }

                req.session.user = user;
                req.session.isLoggedin = true;
                req.session.save(result => {
                    res.redirect('/')
                })
            })
            .catch(err => console.log(err))
        } else {
            req.flash('errorLogin', 'Wrong Email')
            res.redirect('/login')
        }
    })
    .catch(err => console.log(err))
}

exports.getSignup = (req, res, next) => {
    let errorMessage = req.flash('errorSignup')[0]
    res.render('auth/signup', {
        pageTitle: 'signup',
        path: '/signup',
        isAuthenticated: false,
        errorMessage: errorMessage,
        errors: [],
        oldInputs: {
            email: '',
            password: '',
            confirmPassword: '',
        }
    })
}

exports.postSignup = (req, res, next) => {
    const {email, password, confirmPassword} = req.body;
    const errors = validationResult(req).errors
    console.log(errors)

    if(errors.length !== 0){
        return res.render('auth/signup', {
            pageTitle: 'signup',
            path: '/signup',
            isAuthenticated: false,
            errorMessage: errors[0].msg,
            errors: errors,
            oldInputs: {
                email: email,
                password: password,
                confirmPassword: confirmPassword,
            }
        })
    }

    User.findOne({email: email})
    .then(user => {
        if(user) {
            req.flash('errorSignup', 'Email already in use')
            res.redirect('/signup')
        } else {
            bcrypt.hash(password, 12)
            .then(hashedPass => {
                User.create({email: email, password: hashedPass})
                .then(result => {
                    res.redirect('/login')
                    transport.sendMail({
                        to: email,
                        from: 'shehabeddin99@gmail.com',
                        subject: 'SignUp Proccess',
                        html: `
                        <div 
                        style="
                        padding: 10px;
                        text-align: center;
                        align-items: center;
                        vertical-align: center;
                        width: 100%;
                        background-color: green;
                        color: white;
                        font-weight: 700;
                        font-size: 23px;
                        ">Shop Store</div>
                        <div style="text-align:center;">
                            <h1 style="t">You have signed up successfully</h1>
                            <h3>Thank you for registering</h3>
                        </div>
                        <div style="width: 100%; height: 50px; background-color: green"></div>
                        `
                    })
                })
                .catch(err => console.log(err))
            })
            .catch(err => console.log(err))
        }
    })
    .catch(err => console.log(err))
}

exports.getResetPass = (req, res, next) => {
    let errorMessage = req.flash('errorReset')[0]
    res.render('auth/resetPassword', {
        pageTitle: 'Reset Password',
        path: '/resetPassword',
        isAuthenticated: false,
        errorMessage: errorMessage,
    })
}

exports.postResetPass = (req, res, next) => {
    const {email} = req.body;
    crypto.randomBytes(32, (err, buffer) => {
        if(err){
            req.flash('errorReset', 'Proccess been failed, please try again')
            return res.redirect('/resetPassword')
        }

        const token = buffer.toString('hex');
        User.findOne({email: email})
        .then(user => {
            if(user){
                res.redirect('/resetPassword');
                return transport.sendMail({
                    to: email,
                    from: 'shehabeddin99@gmail.com',
                    subject: 'Reset Password',
                    html: `
                    <div 
                    style="
                    padding: 10px;
                    text-align: center;
                    align-items: center;
                    vertical-align: center;
                    width: 100%;
                    background-color: green;
                    color: white;
                    font-weight: 700;
                    font-size: 23px;
                    ">Shop Store</div>
                    <div style="text-align:center;">
                        <h1>Welcome Again</h1>
                        <h3>To proceed reseting your password proccess check this <a href="http://localhost:3000/newPassword/${token}">Link</a></h3>
                    </div>
                    <div style="width: 100%; height: 50px; background-color: green"></div>
                    `
                })
                .then(result => {
                    user.token = token;
                    user.tokenExpirationDate = new Date(),
                    user.save()
                })
            } else {
                req.flash('errorReset', 'No such user has been found!')
                res.redirect('/resetPassword');
            }
        })
        .catch(err => console.log(err))
    })
}

exports.getNewPass = (req, res, next) => {
    const token = req.params.token;
    const errorMessage = req.flash('error')[0];

    User.findOne({token: token})
    .then(user => {
        res.render('auth/newPassword', {
            pageTitle: 'New Password',
            path: '/newPassword',
            isAuthenticated: false,
            errorMessage: errorMessage,
            userId: user._id,
        })
    })
    .catch(err => console.log(err))
}

exports.postNewPass = (req, res, next) => {
    const {password, confirmPassword, userId} = req.body;
    if(password !== confirmPassword){
        req.flash('error', `Passwords doesn't match, please try again`);
        return res.redirect('/newPassword');
    }

    bcrypt.hash(password, 12)
    .then(hashedPassword => {
        User.findById({_id: userId})
        .then(user => {
            user.password = hashedPassword;
            user.token = undefined;
            user.tokenExpirationDate = undefined;
            user.save(result => {
                res.redirect('/login')
            })
        })
        .catch(err => console.log(err))
    })
    .catch(err => console.log(err))
}

exports.getLogout = (req, res, next) => {
    req.session.destroy(result => {
        // console.log(result)
        res.redirect('/login')
    })
}