const express = require("express");
const {
  fetchAllFilteredProducts,
  getProductDetails,
} = require("../../controllers/shop/products-controller");

const router = express.Router();

router.get("/get", fetchAllFilteredProducts);
router.get("/get/:id", getProductDetails);

module.exports = router;
