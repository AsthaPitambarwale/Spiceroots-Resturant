import Offer from '../models/Offer.js';

// @desc    Get all active offers
// @route   GET /api/offers
// @access  Public
export const getAllOffers = async (req, res) => {
  try {
    const currentDate = new Date();

    const offers = await Offer.find({
      isActive: true,
      validFrom: { $lte: currentDate },
      validUntil: { $gte: currentDate }
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: offers.length,
      data: offers
    });
  } catch (error) {
    console.error('Get all offers error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

// @desc    Get offer by code
// @route   GET /api/offers/:code
// @access  Public
export const getOfferByCode = async (req, res) => {
  try {
    const offer = await Offer.findOne({
      code: req.params.code.toUpperCase(),
      isActive: true
    });

    if (!offer) {
      return res.status(404).json({
        success: false,
        message: 'Offer not found or inactive'
      });
    }

    // Check if offer is valid
    const currentDate = new Date();
    if (currentDate < offer.validFrom || currentDate > offer.validUntil) {
      return res.status(400).json({
        success: false,
        message: 'Offer is not valid at this time'
      });
    }

    // Check usage limit
    if (offer.usageLimit && offer.usedCount >= offer.usageLimit) {
      return res.status(400).json({
        success: false,
        message: 'Offer usage limit reached'
      });
    }

    res.status(200).json({
      success: true,
      data: offer
    });
  } catch (error) {
    console.error('Get offer by code error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

// @desc    Create new offer
// @route   POST /api/offers
// @access  Private/Admin
export const createOffer = async (req, res) => {
  try {
    const {
      code,
      title,
      description,
      discountType,
      discountValue,
      minOrderAmount,
      maxDiscount,
      validFrom,
      validUntil,
      usageLimit,
      applicableCategories
    } = req.body;

    // Check if offer code already exists
    const offerExists = await Offer.findOne({ code: code.toUpperCase() });
    if (offerExists) {
      return res.status(400).json({
        success: false,
        message: 'Offer code already exists'
      });
    }

    const offer = await Offer.create({
      code: code.toUpperCase(),
      title,
      description,
      discountType,
      discountValue,
      minOrderAmount,
      maxDiscount,
      validFrom,
      validUntil,
      usageLimit,
      applicableCategories
    });

    res.status(201).json({
      success: true,
      data: offer
    });
  } catch (error) {
    console.error('Create offer error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

// @desc    Update offer
// @route   PUT /api/offers/:id
// @access  Private/Admin
export const updateOffer = async (req, res) => {
  try {
    let offer = await Offer.findById(req.params.id);

    if (!offer) {
      return res.status(404).json({
        success: false,
        message: 'Offer not found'
      });
    }

    // Check if new code already exists (if code is being updated)
    if (req.body.code && req.body.code.toUpperCase() !== offer.code) {
      const codeExists = await Offer.findOne({ code: req.body.code.toUpperCase() });
      if (codeExists) {
        return res.status(400).json({
          success: false,
          message: 'Offer code already exists'
        });
      }
      req.body.code = req.body.code.toUpperCase();
    }

    offer = await Offer.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    res.status(200).json({
      success: true,
      data: offer
    });
  } catch (error) {
    console.error('Update offer error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

// @desc    Delete offer
// @route   DELETE /api/offers/:id
// @access  Private/Admin
export const deleteOffer = async (req, res) => {
  try {
    const offer = await Offer.findById(req.params.id);

    if (!offer) {
      return res.status(404).json({
        success: false,
        message: 'Offer not found'
      });
    }

    await Offer.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Offer deleted successfully'
    });
  } catch (error) {
    console.error('Delete offer error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};
