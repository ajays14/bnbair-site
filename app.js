//PACKAGES
const express = require('express')
const path = require('path');
const mongoose = require('mongoose');
const engine = require('ejs-mate');
const methodOverride = require('method-override')
const session = require('express-session');
const flash = require('connect-flash');
const Joi = require('joi');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');


//FILES
const AppError = require('./utils/AppError');
const bnbairRoutes = require('./routes/bnbair');
const reviewRoutes = require('./routes/review');
const userRoutes = require('./routes/users');


mongoose.connect('mongodb://localhost:27017/bnbair', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});

const db = mongoose.connection;
db.on("error", console.error.bind(console,"connection error:"));
db.once("open", ()=>{
    console.log("Database connected");
});

const app = express();

app.engine('ejs',engine);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))
app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

const sessionConfig = {
    secret: 'thisshouldbeabettersecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + (1000*60*60*24*7),
        maxAge: Date.now() + (1000*60*60*24*7)
    }
}
app.use(session(sessionConfig));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next) =>{
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

//IMPORTED ROUTES
app.use('/bnbairs', bnbairRoutes);
app.use('/bnbairs/:id/reviews', reviewRoutes)
app.use('/', userRoutes);

//BASIC ROUTES 
app.get('/', (req,res) =>{
    res.render('home')
})

app.all('*', (req,res,next) =>{
    next(new AppError("This page does not exist!",404));
})

app.use((err,req,res,next) => {
    const {status = 500} = err;
    if(!err.message) err.message = 'Something went wrong'
    res.status(status).render('error',{err});
})

app.listen(3000, () =>{
    console.log("ON PORT 3000");
})