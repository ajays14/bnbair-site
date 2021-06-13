const express = require('express');
const router = express.Router({mergeParams: true});
const Bnbair = require('../models/places');
const Review = require('../models/review');
const catchAsync = require('../utils/catchAsync');
const {validateReview, isLoggedIn, isReviewAuthor} = require('../middleware');

router.post('/', isLoggedIn, validateReview, catchAsync(async (req,res) =>{
    const bnbair = await Bnbair.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    bnbair.reviews.push(review);
    await review.save();
    await bnbair.save();
    req.flash('success', 'Thanks for leaving a review!');
    res.redirect(`/bnbairs/${bnbair._id}`);
}));


router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(async (req,res) =>{
    const {id, reviewId} = req.params;
    await Bnbair.findByIdAndUpdate(id, {$pull: {reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash('success','We successfully deleted your review!');
    res.redirect(`/bnbairs/${id}`);
}))

module.exports = router;