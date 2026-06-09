import Order from "../model/orderModel.js"; // ✅ Keep this
import User from "../model/userModel.js"; // ✅ Keep this
import { sendNotification } from "../services/notificationService.js";
//for user//
export const placeOrder = async (req, res) => {
  try {
    const { items, amount, address } = req.body;
    const userId = req.userId;

    const orderData = {
      items,
      amount,
      userId,
      address,
      paymentMethod: "COD",
      payment: false,
      status: "Placed",
      date: Date.now(),
    };

    const newOrder = new Order(orderData);
    await newOrder.save();

    const user = await User.findById(userId);
    await User.findByIdAndUpdate(userId, { cartData: {} });

    sendNotification({
      isAdmin: true,
      title: "New Order Placed",
      message: `${user ? user.name : "A customer"} has placed an order of $${amount}.`,
      type: "order_placed",
    });

    return res.status(201).json({ message: "Order Placed" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Order Place error" });
  }
};

export const userOrders = async (req, res) => {
  try {
    const userId = req.userId;
    const orders = await Order.find({ userId });
    return res.status(200).json(orders);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "userOrders error" }); // ❗ Fixed 200 → 500
  }
};

//for admin//

export const allOrders = async (req, res) => {
  try {
    const orders = await Order.find({});
    res.status(200).json(orders);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "adminAllOrders error" });
  }
};

export const updateStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;
    const order = await Order.findByIdAndUpdate(orderId, { status }, { new: true });

    if (order) {
      sendNotification({
        userId: order.userId,
        title: "Order Status Updated",
        message: `Your order status has been updated to "${status}".`,
        type: "order_status_updated",
      });
    }

    return res.status(201).json({ message: "Status Updated" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
