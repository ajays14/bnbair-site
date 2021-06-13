import Bnbair from "../models/places";
import Review from "../models/review";

module.exports.createReview = async (req, res) => {
  const bnbair = await Bnbair.findById(req.params.id);
  const review = new Review(req.body.review);
  review.author = req.user._id;
  bnbair.reviews.push(review);
  await review.save();
  await bnbair.save();
  req.flash("success", "Thanks for leaving a review!");
  res.redirect(`/bnbairs/${bnbair._id}`);
};

module.exports.deleteReview = async (req, res) => {
  const { id, reviewId } = req.params;
  await Bnbair.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  req.flash("success", "We successfully deleted your review!");
  res.redirect(`/bnbairs/${id}`);
};
