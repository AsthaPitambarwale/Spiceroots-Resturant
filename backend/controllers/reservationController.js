import Reservation from '../models/Reservation.js';
import Notification from '../models/Notification.js';

// @desc    Create new reservation
// @route   POST /api/reservations
// @access  Private
export const createReservation = async (req, res) => {
  try {
    const { date, mealSlot, timeSlot, guests, name, phone, specialRequests } = req.body;

    // Validate date is in the future
    const reservationDate = new Date(date);
    if (reservationDate < new Date()) {
      return res.status(400).json({
        success: false,
        message: 'Reservation date must be in the future'
      });
    }

    const reservation = await Reservation.create({
      user: req.user._id,
      date,
      mealSlot,
      timeSlot,
      guests,
      name,
      phone,
      specialRequests
    });

    // Create notification for user
    await Notification.create({
      user: req.user._id,
      title: 'Reservation Confirmed',
      message: `Your reservation for ${guests} guest(s) on ${new Date(date).toLocaleDateString()} has been confirmed.`,
      type: 'reservation',
      relatedId: reservation._id.toString()
    });

    res.status(201).json({
      success: true,
      data: reservation
    });
  } catch (error) {
    console.error('Create reservation error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

// @desc    Get reservations for logged in user
// @route   GET /api/reservations/my-reservations
// @access  Private
export const getMyReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find({ user: req.user._id })
      .populate('user', 'name email phone')
      .sort({ date: -1 });

    res.status(200).json({
      success: true,
      count: reservations.length,
      data: reservations
    });
  } catch (error) {
    console.error('Get my reservations error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

// @desc    Get all reservations
// @route   GET /api/reservations
// @access  Private/Admin
export const getAllReservations = async (req, res) => {
  try {
    const { status, date } = req.query;

    let query = {};

    if (status) {
      query.status = status;
    }

    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1);

      query.date = {
        $gte: startDate,
        $lt: endDate
      };
    }

    const reservations = await Reservation.find(query)
      .populate('user', 'name email phone')
      .sort({ date: 1, timeSlot: 1 });

    res.status(200).json({
      success: true,
      count: reservations.length,
      data: reservations
    });
  } catch (error) {
    console.error('Get all reservations error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

// @desc    Update reservation status
// @route   PUT /api/reservations/:id/status
// @access  Private/Admin
export const updateReservationStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const reservation = await Reservation.findById(req.params.id);

    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: 'Reservation not found'
      });
    }

    const validStatuses = ['pending', 'confirmed', 'cancelled', 'completed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    reservation.status = status;
    await reservation.save();

    // Create notification for user
    const statusMessages = {
      confirmed: 'Your reservation has been confirmed',
      cancelled: 'Your reservation has been cancelled',
      completed: 'Your reservation has been completed'
    };

    if (statusMessages[status]) {
      await Notification.create({
        user: reservation.user,
        title: 'Reservation Status Updated',
        message: statusMessages[status],
        type: 'reservation',
        relatedId: reservation._id.toString()
      });
    }

    res.status(200).json({
      success: true,
      data: reservation
    });
  } catch (error) {
    console.error('Update reservation status error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};
