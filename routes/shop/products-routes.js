const express = require("express");
const {
  fetchAllFilteredProducts,
} = require("../../controllers/shop/products-controller");

const router = express.Router();

router.get("/get", fetchAllFilteredProducts);

module.exports = router;
