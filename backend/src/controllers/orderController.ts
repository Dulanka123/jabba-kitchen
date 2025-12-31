import { Request, Response } from 'express';
import Order from '../models/Order';
import Product from '../models/Product'; // 👈 1. Product Model එක Import කළා (Stock අඩු කරන්න ඕන නිසා)

// @desc    Create new order (Order එකක් දාන්න සහ Stock අඩු කරන්න)
// @route   POST /api/orders
export const addOrderItems = async (req: Request, res: Response) => {
  try {
    const { orderItems, totalPrice, user, status } = req.body;

    if (orderItems && orderItems.length === 0) {
      res.status(400).json({ message: 'No order items' });
      return;
    }

    // 1. Order එක හදලා Save කරනවා
    const order = new Order({
      orderItems,
      user, // User ID එක (Log වෙලා ඉන්නවා නම්)
      totalPrice,
      status: status || 'Pending' // Status එක එව්වේ නැත්නම් Pending කියලා ගන්නවා
    });

    const createdOrder = await order.save();

    // 👇 2. STOCK UPDATE LOGIC (මේ කොටස අලුතින් එකතු කළා)
    // Order එකේ තියෙන හැම Item එකක්ම එකින් එක අරගෙන Stock එක අඩු කරනවා
    if (createdOrder) {
      for (const item of orderItems) {
        // අදාල Product එක Database එකෙන් හොයාගන්නවා
        const product = await Product.findById(item.product);

        if (product) {
          // දැනට තියෙන Stock එකෙන් Order කරපු ප්‍රමාණය අඩු කරනවා
          product.countInStock = product.countInStock - item.qty;

          // ගාණ සෘණ (Negative) වෙන්න දෙන්නේ නෑ (ආරක්ෂාවට)
          if (product.countInStock < 0) {
             product.countInStock = 0;
          }

          await product.save(); // අලුත් Stock එක Save කරනවා
        }
      }
    }

    res.status(201).json(createdOrder);
    
  } catch (error) {
    console.error(error); // Error එක Console එකේ පෙන්නන්න
    res.status(500).json({ message: 'Order creation failed' });
  }
};

// @desc    Get all orders (Orders ඔක්කොම බලන්න)
// @route   GET /api/orders
export const getOrders = async (req: Request, res: Response) => {
  try {
    const orders = await Order.find({}).sort({ createdAt: -1 }); // අලුත්ම ඒවා උඩින්
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
};

// @desc    Update order status (Kitchen Display එකට සහ Admin ට)
// @route   PUT /api/orders/:id
export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      // 👇 කලින් තිබ්බේ 'completed' විතරයි. දැන් එවන ඕනෑම Status එකක් ගන්නවා (Ready, Completed etc.)
      order.status = req.body.status || 'Completed'; 
      
      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Update failed' });
  }
};