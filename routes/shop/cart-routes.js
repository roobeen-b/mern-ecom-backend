const express = require("express");
const {
  addToCart,
  fetchCartItems,
  updateCartItemQty,
  deleteCartItems,
} = require("../../controllers/shop/cart-controller");

const router = express.Router();

router.post("/add", addToCart);
router.get("/get/:userId", fetchCartItems);
router.put("/update", updateCartItemQty);
router.delete("/delete/:userId/:productId", deleteCartItems);

module.exports = router;
