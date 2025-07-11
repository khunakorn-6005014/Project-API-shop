// APIproject/shipping/routes/shippingRoutes.js
import express from "express";
import { createShipment,userAcceptance,updateShipmentStatus } from "../controllers/shippingController.js";
//import verifyToken from "auth-lib";
//import verifyToken from "../../config/auth.middleware.js"
const router = express.Router();

// Route for creating a shipment (with provided address details)
router.post("/create", createShipment);

// Route for user acceptance or return decision
router.post("/acceptance", userAcceptance);
router.post("/update-status", updateShipmentStatus);



export default router;