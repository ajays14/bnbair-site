const express = require("express");
const router = express.Router({ mergeParams: true });
const catchAsync = require("../utils/catchAsync");
const bnbairs = require("../controllers/reviews");
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware");

router.post("/", isLoggedIn, validateReview, catchAsync(bnbairs.createReview));

router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  catchAsync(bnbairs.deleteReview)
);

module.exports = router;
