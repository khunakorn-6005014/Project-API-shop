// product-service/src/routes/product.routes.js
import express from 'express';
import { createProduct ,updateProduct ,deletedProduct,viewProductId,getAllProduct} from '../controller/product.controller.js';

const router = express.Router();

router.post('/new-product', createProduct);
router.post("/updated/:id", updateProduct);
router.delete("/deleted/:id",deletedProduct);
router.get("/detail/:id", viewProductId);
router.get("/Products", getAllProduct);

export default router;