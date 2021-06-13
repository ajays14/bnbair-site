const express = require('express');
const router = express.Router();
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');
const Bnbair = require('../models/places');
const {isLoggedIn,isAuthor,validateBnbair} = require('../middleware');

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
    const bnbair = await (await Bnbair.findById(id)
    .populate({path:'reviews', populate: {path: 'author'}}).populate('author'));
    if(!bnbair){
        req.flash('error','Cannot find that bnbair');
        return res.redirect('/bnbairs');
    }
    res.render('bnbairs/show', {bnbair})
}));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(async (req,res) => {
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
    const bnbair = new Bnbair(req.body.bnbair);
    bnbair.author = req.user._id;
    await bnbair.save();
    req.flash('success', 'Successfully made a new bnbair!');
    res.redirect(`/bnbairs/${bnbair._id}`);
}));

//PUT ROUTES

router.put('/:id', isLoggedIn, isAuthor, validateBnbair, catchAsync(async(req,res) =>{
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

    req.flash('success', 'Successfully removed your bnbair listing!');
    res.redirect('/bnbairs');
}));

module.exports = router;