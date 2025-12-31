import express from 'express';
import { addOrderItems, getOrders } from '../controllers/orderController';
import Order from '../models/Order'; // ඔයාගේ Order Model එක

const router = express.Router();

// 1. Order එකක් දාන්න
router.post('/', addOrderItems);

// 2. Orders ඔක්කොම ගන්න (Kitchen එකට)
router.get('/', getOrders);

// 👇 3. Order Status එක Update කරන්න (මේක තමයි අපි අලුතින් හැදුවේ)
// Frontend එකේ URL එකට ගැලපෙන විදියට '/:id' ලෙස වෙනස් කළා.
router.put('/:id', async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (order) {
      order.status = status;
      const updatedOrder = await order.save();
      res.json(updatedOrder); // අලුත් Data එක Frontend එකට යවනවා
    } else {
      res.status(404).json({ message: 'Order Not Found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error During Update' });
  }
});

// 4. Customer කෙනෙක්ගේ Orders වෙනම ගන්න Route එක
router.get('/user/:userId', async (req, res) => {
  try {
    const orders = await Order.find({ user: req.params.userId }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Fetching orders failed', error });
  }
});

export default router;