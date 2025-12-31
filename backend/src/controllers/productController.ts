import { Request, Response } from 'express';
import Product from '../models/Product';

// @desc    Get all products
// @route   GET /api/products
export const getProducts = async (req: Request, res: Response) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Create a product
// @route   POST /api/products
export const createProduct = async (req: Request, res: Response) => {
  try {
    // 👇 countInStock මෙතනට එකතු කළා
    const { name, price, category, image, description, countInStock } = req.body;

    const product = new Product({
      name,
      price,
      category,
      image,
      description,
      // 👇 Stock එක ආවේ නැත්නම් 0 දානවා
      countInStock: countInStock || 0, 
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(500).json({ message: 'Product creation failed' });
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// 👇 මේ කොටස අලුතින් එකතු කළා (Stock Update කරන්න ඕන නිසා)
export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { name, price, description, image, category, countInStock } = req.body;

    const product = await Product.findById(req.params.id);

    if (product) {
      product.name = name || product.name;
      product.price = price || product.price;
      product.description = description || product.description;
      product.image = image || product.image;
      product.category = category || product.category;
      
      // 👇 Stock Update කිරීම
      product.countInStock = countInStock !== undefined ? countInStock : product.countInStock;

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Product update failed' });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// 👇 මේකත් එකතු කළා (Admin ට කෑම අයින් කරන්න ඕන වුනොත්)
export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      await product.deleteOne();
      res.json({ message: 'Product removed' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Product deletion failed' });
  }
};