import Order from "../models/Order.js";
import Notification from "../models/Notification.js";

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
export const createOrder = async (req, res) => {
  try {
    const order = await Order.create({
      user: req.user._id,
      items: req.body.items,
      totalAmount: req.body.totalAmount,
      paymentMethod: "cod",
      paymentStatus: "pending",
      orderStatus: "pending",
      customerName: req.body.customerName,
      customerPhone: req.body.customerPhone,
      deliveryAddress: req.body.deliveryAddress,
      deliveryCity: req.body.deliveryCity,
      deliveryInstructions: req.body.deliveryInstructions,
    });

    await Notification.create({
      user: req.user._id,
      title: "Order Placed",
      message: `Order #${order._id.toString().slice(-6)} placed`,
      type: "order",
      relatedId: order._id,
    });

    res.status(201).json({ success: true, data: order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Get orders for logged in user
// @route   GET /api/orders/my-orders
// @access  Private
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate("user", "name email phone")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    console.error("Get my orders error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

// @desc    Get single order by ID
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "user",
      "name email phone",
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Check if user is authorized to view this order
    if (
      order.user._id.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to view this order",
      });
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    console.error("Get order by ID error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate("user", "name email phone")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    console.error("Get all orders error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderStatus, estimatedDeliveryTime } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (orderStatus) {
      order.orderStatus = orderStatus;
    }

    if (estimatedDeliveryTime) {
      order.estimatedDeliveryTime = estimatedDeliveryTime;
    }

    // AUTO ASSIGN DELIVERY PARTNER
    if (orderStatus === "out_for_delivery" && !order.deliveryPartner) {
      const partners = [
        {
          name: "Rahul Sharma",
          phone: "9876543210",
          vehicle: "MH01AB1234",
        },
        {
          name: "Amit Singh",
          phone: "9876543211",
          vehicle: "MH02CD5678",
        },
        {
          name: "Vikas Kumar",
          phone: "9876543212",
          vehicle: "MH03EF9876",
        },
        {
          name: "Rajesh Kumar",
          phone: "+91 9876543210",
          vehicle: "MH 01 AB 1234",
        },
        {
          name: "Priya Sharma",
          phone: "+91 9876543211",
          vehicle: "DL 02 CD 5678",
        },
        {
          name: "Amit Patel",
          phone: "+91 9876543212",
          vehicle: "KA 03 EF 9012",
        },
        {
          name: "Sneha Reddy",
          phone: "+91 9876543213",
          vehicle: "TS 04 GH 3456",
        },
      ];

      const randomPartner =
        partners[Math.floor(Math.random() * partners.length)];

      order.deliveryPartner = randomPartner;

      order.estimatedDeliveryTime = "30-40 mins";
    }

    await order.save();

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    console.error("Update order status error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Assign delivery partner to order
// @route   PUT /api/orders/:id/delivery-partner
// @access  Private/Admin
export const assignDeliveryPartner = async (req, res) => {
  try {
    const { name, phone, vehicle } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    order.deliveryPartner = {
      name,
      phone,
      vehicle,
    };

    await order.save();

    // Create notification for user
    await Notification.create({
      user: order.user,
      title: "Delivery Partner Assigned",
      message: `${name} has been assigned to deliver your order`,
      type: "order",
      relatedId: order._id.toString(),
    });

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    console.error("Assign delivery partner error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};
