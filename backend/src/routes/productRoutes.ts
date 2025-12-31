import express from 'express';
// අපි කලින් හදපු Controllers මෙතනට ගෙන්නගන්නවා
import { 
    getProducts, 
    createProduct, 
    updateProduct, // 👈 මේක තමයි Edit කරන්න ඕන කරන කෑල්ල
    deleteProduct 
} from '../controllers/productController';

const router = express.Router();

// 1. Items බලන්න (GET) සහ අලුත් ඒවා දාන්න (POST)
router.route('/')
    .get(getProducts)
    .post(createProduct);

// 2. Item එකක් වෙනස් කරන්න (PUT) සහ මකන්න (DELETE)
// 👇 404 එන්නේ මේ කොටස (PUT) නැති නිසා. දැන් මේක දැම්මම හරි යයි.
router.route('/:id')
    .put(updateProduct)    
    .delete(deleteProduct);

export default router;