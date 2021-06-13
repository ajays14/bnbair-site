const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const { isLoggedIn, isAuthor, validateBnbair } = require("../middleware");
const bnbairs = require("../controllers/bnbairs");

router
  .route("/")
  .get(catchAsync(bnbairs.index))
  .post(isLoggedIn, validateBnbair, catchAsync(bnbairs.createBnbair));

router.get("/new", isLoggedIn, bnbairs.renderNewForm);

router.get(
  "/:id/edit",
  isLoggedIn,
  isAuthor,
  catchAsync(bnbairs.renderEditForm)
);

router
  .route("/:id")
  .get(catchAsync(bnbairs.showBnbair))
  .put(isLoggedIn, isAuthor, validateBnbair, catchAsync(bnbairs.updateBnbair))
  .delete(isLoggedIn, catchAsync(bnbairs.removeBnbair));

module.exports = router;
