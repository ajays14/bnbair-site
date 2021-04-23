const express = require('express')
const path = require('path');
const mongoose = require('mongoose');
const engine = require('ejs-mate');
const methodOverride = require('method-override')
const Bnbair = require('./models/places');
const Review = require('./models/review')
const AppError = require('./utils/AppError');
const catchAsync = require('./utils/catchAsync');
const Joi = require('joi');
const {bnbSchema, reviewSchema} = require('./schemas');
const { join } = require('path');

mongoose.connect('mongodb://localhost:27017/bnbair', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
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


const validateBnbair = (req,res,next) =>{
    const {error} = bnbSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',');
        throw new AppError(msg,400);
    } else{
        next();
    }
}

const validateReview = (req,res,next) =>{
    const {error} = reviewSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',');
        throw new AppError(msg,400);
    } else{
        next();
    }
}

//GET ROUTES

app.get('/bnbairs', catchAsync(async (req,res) =>{
    const bnbairs = await Bnbair.find({});
    res.render('bnbairs/index', {bnbairs});
}));

app.get('/bnbairs/new', catchAsync((req,res) =>{
    res.render('bnbairs/new');
}));


app.get('/bnbairs/:id', catchAsync(async (req,res) =>{
    const {id} = req.params;
    const bnbair = await Bnbair.findById(id).populate('reviews');
    console.log(bnbair);
    res.render('bnbairs/show', {bnbair})
}));

app.get('/bnbairs/:id/edit', catchAsync(async (req,res) => {
    const {id} = req.params;
    const bnbair = await Bnbair.findById(id);
    res.render('bnbairs/edit', {bnbair});
}));

app.get('/', (req,res) =>{
    res.render('home')
})


//POST ROUTES

app.post('/bnbairs', validateBnbair, catchAsync(async (req,res) =>{
        
        const bnbair = new Bnbair(req.body);
        await bnbair.save();
        res.redirect(`/bnbairs/${bnbair._id}`);
}));

app.post('/bnbairs/:id/reviews', validateReview, catchAsync(async (req,res) =>{
    const bnbair = await Bnbair.findById(req.params.id);
    const review = new Review(req.body.review);
    bnbair.reviews.push(review);
    await review.save();
    await bnbair.save();
    res.redirect(`/bnbairs/${bnbair._id}`);
}));

//PUT ROUTES

app.put('/bnbairs/:id', validateBnbair, catchAsync(async(req,res) =>{
    if(!req.body.bnbair) throw new AppError('Invalid BnbAir Data',400);
    const {id} = req.params;
    const bnbair = await Bnbair.findByIdAndUpdate(id, {...req.body.bnbair}, {useFindAndModify: false});
    res.redirect(`/bnbairs/${bnbair._id}`)
}));


//DELETE ROUTES

app.delete('/bnbairs/:id', catchAsync(async(req,res) =>{
    const {id} = req.params;
    const bnbair = await Bnbair.findByIdAndDelete(id);
    res.redirect('/bnbairs');
}));

app.delete('/bnbairs/:id/reviews/:reviewId', catchAsync(async (req,res) =>{
    const {id, reviewId} = req.params;
    await Bnbair.findByIdAndUpdate(id, {$pull: {reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/bnbairs/${id}`);

}))

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