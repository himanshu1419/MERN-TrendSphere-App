const paypal = require("../../helpers/paypal");
const Order = require("../../models/Order");
const Cart = require("../../models/Cart");
const Product = require("../../models/Product");

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

    console.log("🟢 Received Order Request:", req.body);

    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty. Add items before proceeding.",
      });
    }

    const create_payment_json = {
      intent: "sale",
      payer: {
        payment_method: "paypal",
      },
      redirect_urls: {
        return_url: "http://localhost:5173/shop/paypal-return",
        cancel_url: "http://localhost:5173/shop/paypal-cancel",
      },
      transactions: [
        {
          item_list: {
            items: cartItems.map((item) => ({
              name: item.title,
              sku: item.productId,
              price: item.price.toFixed(2),
              currency: "USD",
              quantity: item.quantity,
            })),
          },
          amount: {
            currency: "USD",
            total: totalAmount.toFixed(2),
          },
          payee: {
            email: "sb-hq1rm37372123@business.example.com", // Replace with actual business PayPal email
          },
          description: "Your order payment",
        },
      ],
    };

    console.log("📤 Sending Payment Request to PayPal...");
    paypal.payment.create(create_payment_json, async (error, paymentInfo) => {
      if (error) {
        console.error("❌ PayPal Error:", error.response);
        return res.status(500).json({
          success: false,
          message: "Error while creating PayPal payment",
          error: error.response,
        });
      }

      console.log("✅ PayPal Payment Response:", JSON.stringify(paymentInfo, null, 2));

      const approvalLink = paymentInfo.links.find((link) => link.rel === "approval_url");
      if (!approvalLink) {
        console.error("❌ No approval URL found in PayPal response");
        return res.status(500).json({
          success: false,
          message: "No approval URL found in PayPal response",
        });
      }

      const approvalURL = approvalLink.href;
      console.log("🔗 Approval URL:", approvalURL);

      // Only save the order if PayPal payment creation is successful
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
      console.log("✅ Order Saved in Database:", newlyCreatedOrder._id);

      res.status(201).json({
        success: true,
        approvalURL,
        orderId: newlyCreatedOrder._id,
      });
    });
  } catch (error) {
    console.error("🔥 Server Error:", error);
    res.status(500).json({
      success: false,
      message: "An unexpected error occurred!",
    });
  }
};

const capturePayment = async (req, res) => {
  try {
    const { paymentId, payerId, orderId } = req.body;

    console.log("🔄 Capturing Payment:", { paymentId, payerId, orderId });

    let order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found!",
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
          message: `Not enough stock for product ${item.title}`,
        });
      }

      product.totalStock -= item.quantity;
      await product.save();
    }

    await Cart.findByIdAndDelete(order.cartId);
    await order.save();

    console.log("✅ Payment Captured & Order Confirmed:", orderId);
    res.status(200).json({
      success: true,
      message: "Order confirmed",
      data: order,
    });
  } catch (error) {
    console.error("🔥 Capture Payment Error:", error);
    res.status(500).json({
      success: false,
      message: "An unexpected error occurred!",
    });
  }
};

const getAllOrdersByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    console.log("📦 Fetching orders for user:", userId);

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
  } catch (error) {
    console.error("🔥 Fetch Orders Error:", error);
    res.status(500).json({
      success: false,
      message: "An unexpected error occurred!",
    });
  }
};

const getOrderDetails = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("🔍 Fetching order details:", id);

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
  } catch (error) {
    console.error("🔥 Order Details Error:", error);
    res.status(500).json({
      success: false,
      message: "An unexpected error occurred!",
    });
  }
};

module.exports = {
  createOrder,
  capturePayment,
  getAllOrdersByUser,
  getOrderDetails,
};
