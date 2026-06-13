import express from 'express';
import { createOrder, getMyOrders, getOrderById, getAllOrders, updateOrderStatus, assignDeliveryPartner} from '../controllers/orderController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
  .post(protect, createOrder)
  .get(protect, admin, getAllOrders);

router.get('/my-orders', protect, getMyOrders);

router.route('/:id')
  .get(protect, getOrderById);

router.put('/:id/status', protect, admin, updateOrderStatus);
router.put('/:id/delivery-partner', protect, admin, assignDeliveryPartner);

export default router;
