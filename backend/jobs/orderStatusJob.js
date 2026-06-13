import Order from "../models/Order.js";

export const updateExpiredOrders = async () => {
  try {
    const result = await Order.updateMany(
      {
        orderStatus: "out_for_delivery",
        deliveryDeadline: { $lte: new Date() }
      },
      {
        $set: {
          orderStatus: "delivered"
        }
      }
    );

    console.log(
      `Auto delivered ${result.modifiedCount} orders`
    );
  } catch (err) {
    console.error(err);
  }
};