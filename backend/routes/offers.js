import express from 'express';
import { getAllOffers, getOfferByCode, createOffer, updateOffer, deleteOffer } from '../controllers/offerController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
  .get(getAllOffers)
  .post(protect, admin, createOffer);

router.get('/code/:code', getOfferByCode);

router.route('/:id')
  .put(protect, admin, updateOffer)
  .delete(protect, admin, deleteOffer);

export default router;
