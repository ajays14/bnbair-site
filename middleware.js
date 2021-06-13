const {bnbSchema, reviewSchema} = require('./schemas');
const AppError = require('./utils/AppError');
const Bnbair = require('./models/places');
const Review = require('./models/review')

module.exports.isLoggedIn = (req,res,next) =>{
    if(!req.isAuthenticated()){
        req.session.returnTo = req.originalUrl;
        req.flash('error','Please sign in!');
        return res.redirect('/login');
    }
    next();
}

module.exports.validateBnbair = (req,res,next) =>{
    const {error} = bnbSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',');
        throw new AppError(msg,400);
    } else{
        next();
    }
}

module.exports.isAuthor = async(req,res,next) => {
    const {id} = req.params;
    const bnbair = await Bnbair.findById(id);
    if(!bnbair.author.equals(req.user._id)){
        req.flash('error', "You don't have permission to do that!");
        return res.redirect(`/bnbairs/${id}`);
    }
    next();
}

module.exports.isReviewAuthor = async(req,res,next) => {
    const {id, reviewId} = req.params;
    const review = await Review.findById(reviewId);
    if(!review.author.equals(req.user._id)){
        req.flash('error', "You don't have permission to do that!");
        return res.redirect(`/bnbairs/${id}`);
    }
    next();
}

//Middleware validating review params
module.exports.validateReview = (req,res,next) =>{
    const {error} = reviewSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',');
        throw new AppError(msg,400);
    } else{
        next();
    }
}