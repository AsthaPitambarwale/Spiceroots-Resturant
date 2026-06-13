import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  food: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Food",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  price: {
    type: Number,
    required: true,
  },
  image: String,
});

const deliveryPartnerSchema = new mongoose.Schema({
  name: String,
  phone: String,
  vehicle: String,
});

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [orderItemSchema],
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "pending",
    },
    paymentMethod: {
      type: String,
      enum: ["online", "cod"],
      required: true,
    },
    razorpayPaymentId: String,
    orderStatus: {
      type: String,
      enum: [
        "pending",
        "preparing",
        "ready",
        "out_for_delivery",
        "delivered",
        "cancelled",
      ],
      default: "pending",
    },
    customerName: {
      type: String,
      required: true,
    },
    customerPhone: {
      type: String,
      required: true,
    },
    deliveryAddress: {
      type: String,
      required: true,
    },
    deliveryCity: {
      type: String,
      required: true,
    },
    deliveryInstructions: String,
    deliveryPartner: deliveryPartnerSchema,
    deliveryAssignedAt: {
      type: Date,
    },

    deliveryDeadline: {
      type: Date,
    },
    estimatedDeliveryTime: String,
    reviewed: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
);

const Order = mongoose.model("Order", orderSchema);

export default Order;
