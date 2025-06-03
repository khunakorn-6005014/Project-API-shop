//APIproject/product/routes/productRoutes.js
import express from "express"
import verifyToken from "../../config/auth.middleware.js"
import { createProduct ,updateProduct,deletedProduct,viewProductId,getAllProduct} from "../controller/productController.js";

const router = express.Router();
router.post("/new-product", verifyToken,createProduct)
router.post("/updated/:id", verifyToken,updateProduct)
router.delete("/deleted/:id", verifyToken,deletedProduct)
router.get("/deteil/:id", viewProductId)
router.get("/Products", getAllProduct)
export default router;