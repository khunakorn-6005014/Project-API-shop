import express from 'express';
import {viewOrderId} from '../controller/order.controller.js'
const router = express.Router();
router.get('/:id',viewOrderId);

export default router;