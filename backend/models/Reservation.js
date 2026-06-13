import mongoose from 'mongoose';

const reservationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  date: {
    type: Date,
    required: [true, 'Please provide a date']
  },
  mealSlot: {
    type: String,
    enum: ['breakfast', 'lunch', 'dinner'],
    required: true
  },
  timeSlot: {
    type: String,
    required: true
  },
  guests: {
    type: Number,
    required: true,
    min: 1,
  },
  name: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  specialRequests: String,
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'confirmed'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

const Reservation = mongoose.model('Reservation', reservationSchema);

export default Reservation;
