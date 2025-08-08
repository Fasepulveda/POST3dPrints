const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const auth = require('../middleware/auth');

// Get all orders for user
router.get('/', [auth], async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).sort('-createdAt');
    res.json(orders);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Get single order
router.get('/:id', [auth], async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ msg: 'Order not found' });
    }

    // Make sure user is owner
    if (order.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    res.json(order);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Create order
router.post('/', [auth], async (req, res) => {
  try {
    const { items, shippingInfo, paymentInfo, totalPrice } = req.body;

    const order = new Order({
      user: req.user.id,
      items,
      shippingInfo,
      paymentInfo,
      totalPrice,
      status: 'pending'
    });

    await order.save();
    res.json(order);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Update order status - requires seller authentication
router.put('/:id/status', [auth], async (req, res) => {
  try {
    const { status } = req.body;

    // Get order from database
    let order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ msg: 'Order not found' });
    }

    // Update order status
    order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    res.json(order);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
