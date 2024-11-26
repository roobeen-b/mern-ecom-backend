const Order = require("../../models/Order");
const ProductReview = require("../../models/Review");
const Product = require("../../models/Product");

const addNewReview = async (req, res) => {
  try {
    const { userId, productId, userName, reviewMessage, reviewValue } =
      req.body;

    const order = await Order.findOne({
      userId,
      "cartItems.productId": productId,
    });

    if (!order) {
      return res.json({
        success: false,
        message: "Please purchase the product first to write your review",
      });
    }

    const checkExistingReview = await ProductReview.findOne({
      productId,
      userId,
    });
    if (checkExistingReview) {
      return res.status(403).json({
        success: false,
        message: "You have already reviewed this product",
      });
    }

    const newReview = new ProductReview({
      userId,
      productId,
      userName,
      reviewMessage,
      reviewValue,
    });

    await newReview.save();

    const productReviews = await ProductReview.find({ productId });
    const totalNumberOfReviews = productReviews.length;
    const averageReview =
      productReviews?.reduce((sum, review) => sum + review.reviewValue, 0) /
      totalNumberOfReviews;
    await Product.findByIdAndUpdate(productId, { averageReview });

    res.status(200).json({
      success: true,
      message: "Review added successfully",
      data: newReview,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Some error occured",
    });
  }
};

const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Invalid Product",
      });
    }

    const allReviews = await ProductReview.find({ productId });

    res.status(200).json({
      success: true,
      data: allReviews,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Some error occured",
    });
  }
};

module.exports = { addNewReview, getProductReviews };
