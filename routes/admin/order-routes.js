const express = require("express");

const {
  getAllOrders,
  updateOrderStatus,
} = require("../../controllers/admin/order-controller");

const router = express.Router();

router.get("/list", getAllOrders);
router.put("/edit/:orderId", updateOrderStatus);

module.exports = router;
