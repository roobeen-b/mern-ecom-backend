const express = require("express");
const {
  addNewAddress,
  fetchAllAddress,
  editAddress,
  deleteAddress,
} = require("../../controllers/shop/address-controller");

const router = express.Router();

router.post("/add", addNewAddress);
router.get("/get/:userId", fetchAllAddress);
router.put("/edit/:userId/:addressId", editAddress);
router.delete("/delete/:userId/:addressId", deleteAddress);

module.exports = router;
