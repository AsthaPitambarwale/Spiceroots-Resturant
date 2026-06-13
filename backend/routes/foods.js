import express from 'express';
import { getAllFoods, getFoodById, createFood, updateFood, deleteFood } from '../controllers/foodController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
  .get(getAllFoods)
  .post(protect, admin, createFood);

router.route('/:id')
  .get(getFoodById)
  .put(protect, admin, updateFood)
  .delete(protect, admin, deleteFood);

export default router;
