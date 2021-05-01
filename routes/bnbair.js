const express = require('express');
const router = express.Router();
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');
const Bnbair = require('../models/places');
const {bnbSchema} = require('../schemas');
const {isLoggedIn} = require('../middleware');

const validateBnbair = (req,res,next) =>{
    const {error} = bnbSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',');
        throw new AppError(msg,400);
    } else{
        next();
    }
}

//GET ROUTES 

router.get('/', catchAsync(async (req,res) =>{
    const bnbairs = await Bnbair.find({});
    res.render('bnbairs/index', {bnbairs});
}));

router.get('/new', isLoggedIn, (req,res) =>{
    res.render('bnbairs/new');
});


router.get('/:id', catchAsync(async (req,res) =>{
    const {id} = req.params;
    const bnbair = await Bnbair.findById(id).populate('reviews');
    if(!bnbair){
        req.flash('error','Cannot find that bnbair');
        return res.redirect('/bnbairs');
    }
    res.render('bnbairs/show', {bnbair})
}));

router.get('/:id/edit', isLoggedIn, catchAsync(async (req,res) => {
    const {id} = req.params;
    const bnbair = await Bnbair.findById(id);
    if(!bnbair){
        req.flash('error','Cannot find that bnbair');
        return res.redirect('/bnbairs');
    }
    res.render('bnbairs/edit', {bnbair});
}));

//POST ROUTES

router.post('/', isLoggedIn, validateBnbair, catchAsync(async (req,res) =>{
    const bnbair = new Bnbair(req.body);
    await bnbair.save();
    req.flash('success', 'Successfully made a new bnbair!');
    res.redirect(`/bnbairs/${bnbair._id}`);
}));

//PUT ROUTES

router.put('/:id', isLoggedIn, validateBnbair, catchAsync(async(req,res) =>{
    if(!req.body.bnbair) throw new AppError('Invalid BnbAir Data',400);
    const {id} = req.params;
    const bnbair = await Bnbair.findByIdAndUpdate(id, {...req.body.bnbair}, {useFindAndModify: false});
    req.flash('success', 'Successfully updated bnbair!');
    res.redirect(`/bnbairs/${bnbair._id}`)
}));


//DELETE ROUTES

router.delete('/:id', isLoggedIn, catchAsync(async(req,res) =>{
    const {id} = req.params;
    const bnbair = await Bnbair.findByIdAndDelete(id);
    if(!bnbair){
        req.flash('error','Cannot find that bnbair');
        return res.redirect('/bnbairs');
    }
    res.redirect('/bnbairs');
}));

module.exports = router;