const express = require('express');
const router = express.Router({mergeParams: true});
const Bnbair = require('../models/places');
const Review = require('../models/review')
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');
const {reviewSchema} = require('../schemas');

//Middleware validating review params
const validateReview = (req,res,next) =>{
    const {error} = reviewSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',');
        throw new AppError(msg,400);
    } else{
        next();
    }
}

router.post('/', validateReview, catchAsync(async (req,res) =>{
    const bnbair = await Bnbair.findById(req.params.id);
    const review = new Review(req.body.review);
    bnbair.reviews.push(review);
    await review.save();
    await bnbair.save();
    req.flash('success', 'Created new Review');
    res.redirect(`/bnbairs/${bnbair._id}`);
}));


router.delete('/:reviewId', catchAsync(async (req,res) =>{
    const {id, reviewId} = req.params;
    await Bnbair.findByIdAndUpdate(id, {$pull: {reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash('success','Successfully deleted review!');
    res.redirect(`/bnbairs/${id}`);
}))

module.exports = router;