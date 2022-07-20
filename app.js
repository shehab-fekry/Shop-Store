const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const flash = require('connect-flash');
const User = require('./Models/UserM');

const adminRoutes = require('./Routes/Admin');
const shopRoutes = require('./Routes/Shop');
const authRoutes = require('./Routes/Auth');
const errorController = require('./Controllers/404CTRL');

// defining sessions store collection in mongoDB
let Store = new MongoDBStore({
    uri: 'mongodb+srv://shehab-fekry:6gZCZ1mK3oAc9v7s@cluster0.o2ojhxs.mongodb.net/Shop',
    collection: 'sessions',
})

const server = express();

server.set('view engine', 'ejs')
server.set('views', 'Views')

// parsing all incoming requists
server.use(bodyParser.urlencoded({extended: false}))
// granting access to public
server.use(express.static(path.join(__dirname, 'Public')))
// initializing new session
// with the following middleware setup... the session knows its store place in mongoDB and will only be saved there
// modification means (session.isLoggedin = value) or [session.save() , session.destroy()] is called
// req.session is provided
server.use(session({secret: 'my secret', resave: false, saveUninitialized: false, store: Store}))
// csrf middleware is used to prevent csrf attacks on every rendered view with a POST requist form 
// a hidden input with name (_csrf) and value (csrfToken) is added to every form
// every initialized session has its own random csrf
// req.csrfToken() is provided
server.use(csrf())
server.use((req, res, next) => {
    res.locals.csrfToken = req.csrfToken();
    next()
})
// flash middleware used to store a message in the session temporary for error messages and
// then delete it directly after being used
// req.falsh() is provided
server.use(flash())
// the user can be stored in sessions (req.session.user) but his schema functions aren't stored there (only data)
// in order to activate these functions we use (req.user) which will be responsable for his behaviors
server.use((req, res, next)=>{
    if(!req.session.user) // if not logged in
    return next()

    User.findById(req.session.user._id)
    .then(user => {
        req.user = user;
        next()
    })
    .catch(err => console.log(err))
})

server.use('/admin', adminRoutes)
server.use(shopRoutes)
server.use(authRoutes)
server.use(errorController.error)

mongoose.connect('mongodb+srv://shehab-fekry:6gZCZ1mK3oAc9v7s@cluster0.o2ojhxs.mongodb.net/Shop?retryWrites=true&w=majority')
.then(result => {
    server.listen(3000)
})
.catch(err => console.log(err))