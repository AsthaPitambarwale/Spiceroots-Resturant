import express from 'express';
import { createReview, getFoodReviews, getMyReviews } from '../controllers/reviewController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/', protect, createReview);
router.get('/food/:foodId', getFoodReviews);
router.get('/my-reviews', protect, getMyReviews);

export default router;
