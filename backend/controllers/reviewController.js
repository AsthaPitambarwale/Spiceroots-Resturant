import Review from "../models/Review.js";
import Order from "../models/Order.js";
import Food from "../models/Food.js";

// @desc    Create review for order
// @route   POST /api/reviews
// @access  Private
export const createReview = async (req, res) => {
  try {
    console.log("Review Body:", req.body);
    console.log("User:", req.user._id);

    const { order, food, rating, comment } = req.body;

    console.log("Order ID:", order);
    console.log("Food ID:", food);

    // Validate request
    if (!order) {
      return res.status(400).json({
        success: false,
        message: "Order ID is required",
      });
    }

    if (!rating) {
      return res.status(400).json({
        success: false,
        message: "Rating is required",
      });
    }

    // Find order
    const orderExists = await Order.findById(order);

    if (!orderExists) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Check ownership
    if (orderExists.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to review this order",
      });
    }

    // Must be delivered
    if (orderExists.orderStatus !== "delivered") {
      return res.status(400).json({
        success: false,
        message: "Cannot review order that is not delivered",
      });
    }

    // Already reviewed?
    if (orderExists.reviewed) {
      return res.status(400).json({
        success: false,
        message: "Order has already been reviewed",
      });
    }

    // Validate food if provided
    let foodItem = null;

    if (food) {
      foodItem = await Food.findById(food);

      if (!foodItem) {
        return res.status(404).json({
          success: false,
          message: "Food item not found",
        });
      }
    }

    // Create review
    const review = await Review.create({
      user: req.user._id,
      order,
      food: food || undefined,
      rating,
      comment,
    });

    // Mark order reviewed
    orderExists.reviewed = true;
    await orderExists.save();

    // Update food stats
    if (foodItem) {
      const reviews = await Review.find({ food });

      const totalRating = reviews.reduce(
        (sum, review) => sum + review.rating,
        0,
      );

      foodItem.rating = Number((totalRating / reviews.length).toFixed(1));

      foodItem.reviews = reviews.length;

      await foodItem.save();
    }

    const populatedReview = await Review.findById(review._id)
      .populate("user", "name")
      .populate("food", "name image");

    return res.status(201).json({
      success: true,
      data: populatedReview,
    });
  } catch (error) {
    console.error("Create review error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

// @desc    Get reviews for a food item
// @route   GET /api/reviews/food/:foodId
// @access  Public
export const getFoodReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ food: req.params.foodId })
      .populate("user", "name")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews,
    });
  } catch (error) {
    console.error("Get food reviews error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

// @desc    Get reviews for logged in user
// @route   GET /api/reviews/my-reviews
// @access  Private
export const getMyReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ user: req.user._id })
      .populate("food", "name image")
      .populate("order", "totalAmount createdAt")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews,
    });
  } catch (error) {
    console.error("Get my reviews error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};
