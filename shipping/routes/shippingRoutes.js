// APIproject/shipping/routes/shippingRoutes.js
import express from "express";
import { createShipment,userAcceptance,updateShipmentStatus } from "../controllers/shippingController.js";
import verifyToken from "../../config/auth.middleware.js" 

const router = express.Router();

// Route for creating a shipment (with provided address details)
router.post("/create", verifyToken, createShipment);

// Route for user acceptance or return decision
router.post("/acceptance", verifyToken, userAcceptance);
router.post("/update-status", verifyToken, updateShipmentStatus);



export default router;