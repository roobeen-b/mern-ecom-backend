const Order = require("../../models/Order");
const Cart = require("../../models/Cart");
const Product = require("../../models/Product");
const { v4: uuidv4 } = require("uuid");
const { generatePaypalAccessToken } = require("../../helpers/paypal");

const createOrder = async (req, res) => {
  try {
    const {
      userId,
      cartItems,
      addressInfo,
      orderStatus,
      paymentMethod,
      paymentStatus,
      totalAmount,
      orderDate,
      orderUpdateDate,
      paymentId,
      payerId,
      cartId,
    } = req.body;

    const create_payment_json = {
      intent: "CAPTURE",
      purchase_units: [
        {
          // items: cartItems,
          amount: {
            currency_code: "USD",
            value: totalAmount.toFixed(2),
          },
        },
      ],
      payment_source: {
        paypal: {
          experience_context: {
            return_url: "http://localhost:5173/shopping/paypal-return",
            cancel_url: "http://localhost:5173/shopping/paypal-cancel",
          },
        },
      },
    };

    try {
      // const accessToken = await generatePaypalAccessToken();
      // console.log(accessToken);
      fetch("https://api-m.sandbox.paypal.com/v2/checkout/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "PayPal-Request-Id": uuidv4(),
          Authorization: `Bearer ${"A21AALs0zlhob7miQgOaHIHVcAhT2bOq6mqP3WE23nUn0Wr-Hd3XjFbD844ugRDRsedX_TKYHEu9qCjIPc8yiabiy0c20x0XA"}`,
        },
        body: JSON.stringify(create_payment_json),
      })
        .then(async (response) => {
          if (response.ok) {
            const result = await response.json();
            const newlyCreatedOrder = new Order({
              userId,
              cartId,
              cartItems,
              addressInfo,
              orderStatus,
              paymentMethod,
              paymentStatus,
              totalAmount,
              orderDate,
              orderUpdateDate,
              paymentId,
              payerId,
            });

            await newlyCreatedOrder.save();

            const approvalURL = result?.links?.find(
              (link) => link.rel === "payer-action"
            ).href;

            res.status(201).json({
              success: true,
              approvalURL,
              orderId: newlyCreatedOrder._id,
            });
          }
        })
        .catch((error) => {
          console.log(error);

          return res.status(500).json({
            success: false,
            message: "Error while creating paypal payment",
          });
        });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        success: false,
        message: "Error while creating paypal payment",
      });
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

const capturePayment = async (req, res) => {
  try {
    const { paymentId, payerId, orderId } = req.body;

    let order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order can not be found",
      });
    }

    order.paymentStatus = "paid";
    order.orderStatus = "confirmed";
    order.paymentId = paymentId;
    order.payerId = payerId;

    for (let item of order.cartItems) {
      let product = await Product.findById(item.productId);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Not enough stock for this product ${product.title}`,
        });
      }

      product.totalStock -= item.quantity;

      await product.save();
    }

    const getCartId = order.cartId;
    await Cart.findByIdAndDelete(getCartId);

    await order.save();

    res.status(200).json({
      success: true,
      message: "Order confirmed",
      data: order,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

const getAllOrdersByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const orders = await Order.find({ userId });

    if (!orders.length) {
      return res.status(404).json({
        success: false,
        message: "No orders found!",
      });
    }

    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

const getOrderDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found!",
      });
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

module.exports = {
  createOrder,
  capturePayment,
  getAllOrdersByUser,
  getOrderDetails,
};
