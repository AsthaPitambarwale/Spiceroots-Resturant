import express from 'express';
import { createReservation, getMyReservations, getAllReservations, updateReservationStatus } from '../controllers/reservationController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
  .post(protect, createReservation)
  .get(protect, admin, getAllReservations);

router.get('/my-reservations', protect, getMyReservations);

router.put('/:id/status', protect, admin, updateReservationStatus);

export default router;
