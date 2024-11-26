const express = require("express");
const {
  addNewReview,
  getProductReviews,
} = require("../../controllers/shop/product-review-controller");

const router = express.Router();

router.post("/add", addNewReview);
router.get("/get/:productId", getProductReviews);

module.exports = router;
