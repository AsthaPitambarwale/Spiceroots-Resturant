import Food from '../models/Food.js';
import Category from '../models/Category.js';

// @desc    Get all foods with optional filters
// @route   GET /api/foods
// @access  Public
export const getAllFoods = async (req, res) => {
  try {
    const { category, isVegetarian, search } = req.query;

    // Build query object
    let query = {};

    if (category) {
      query.categoryName = category;
    }

    if (isVegetarian !== undefined) {
      query.isVegetarian = isVegetarian === 'true';
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const foods = await Food.find(query).populate('category', 'name icon').sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: foods.length,
      data: foods
    });
  } catch (error) {
    console.error('Get all foods error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

// @desc    Get single food by ID
// @route   GET /api/foods/:id
// @access  Public
export const getFoodById = async (req, res) => {
  try {
    const food = await Food.findById(req.params.id).populate('category', 'name icon description');

    if (!food) {
      return res.status(404).json({
        success: false,
        message: 'Food not found'
      });
    }

    res.status(200).json({
      success: true,
      data: food
    });
  } catch (error) {
    console.error('Get food by ID error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

// @desc    Create new food
// @route   POST /api/foods
// @access  Private/Admin
export const createFood = async (req, res) => {
  try {
    const { name, description, price, category, categoryName, image, isVegetarian, isAvailable } = req.body;

    // Verify category exists
    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return res.status(400).json({
        success: false,
        message: 'Category not found'
      });
    }

    const food = await Food.create({
      name,
      description,
      price,
      category,
      categoryName: categoryName || categoryExists.name,
      image,
      isVegetarian,
      isAvailable
    });

    res.status(201).json({
      success: true,
      data: food
    });
  } catch (error) {
    console.error('Create food error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

// @desc    Update food
// @route   PUT /api/foods/:id
// @access  Private/Admin
export const updateFood = async (req, res) => {
  try {
    let food = await Food.findById(req.params.id);

    if (!food) {
      return res.status(404).json({
        success: false,
        message: 'Food not found'
      });
    }

    // If category is being updated, verify it exists
    if (req.body.category) {
      const categoryExists = await Category.findById(req.body.category);
      if (!categoryExists) {
        return res.status(400).json({
          success: false,
          message: 'Category not found'
        });
      }
      if (!req.body.categoryName) {
        req.body.categoryName = categoryExists.name;
      }
    }

    food = await Food.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    res.status(200).json({
      success: true,
      data: food
    });
  } catch (error) {
    console.error('Update food error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

// @desc    Delete food
// @route   DELETE /api/foods/:id
// @access  Private/Admin
export const deleteFood = async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);

    if (!food) {
      return res.status(404).json({
        success: false,
        message: 'Food not found'
      });
    }

    await Food.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Food deleted successfully'
    });
  } catch (error) {
    console.error('Delete food error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};
