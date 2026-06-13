import express from 'express';
import {
  getMyNotifications,
  markAsRead,
  createNotification
} from '../controllers/notificationController.js';

import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
  .get(protect, getMyNotifications)
  .post(protect, admin, createNotification);

router.put('/:id/read', protect, markAsRead);

export default router;