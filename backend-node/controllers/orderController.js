/**
 * Order Controller - Customer order management
 */
const Order = require('../models/Order');

/**
 * POST /api/orders
 * Create a new order (public - Cash on Delivery)
 * Structured for easy Razorpay integration in the future
 */
const createOrder = async (req, res) => {
  const { customer_name, customer_phone, customer_address, city, pincode, items, total_amount, notes } = req.body;

  // Validation
  if (!customer_name || !customer_phone || !customer_address || !city || !pincode) {
    return res.status(400).json({ message: 'All customer details are required' });
  }

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: 'Order must contain at least one item' });
  }

  if (!total_amount || total_amount <= 0) {
    return res.status(400).json({ message: 'Valid total amount is required' });
  }

  try {
    /*
     * PAYMENT GATEWAY HOOK (Future Razorpay Integration):
     * -------------------------------------------------------
     * To integrate Razorpay:
     * 1. Add `payment_id` and `payment_status` fields to Order model
     * 2. Create Razorpay order here: const razorpayOrder = await razorpay.orders.create(...)
     * 3. Return razorpayOrder.id to frontend for payment
     * 4. Add webhook endpoint to verify payment signature
     * 5. Update order status on successful payment
     * -------------------------------------------------------
     */

    const order = await Order.create({
      customer_name: customer_name.trim(),
      customer_phone: customer_phone.trim(),
      customer_address: customer_address.trim(),
      city: city.trim(),
      pincode: pincode.trim(),
      items,
      total_amount: parseFloat(total_amount),
      payment_method: 'cod',
      status: 'pending',
      notes: notes || '',
    });

    res.status(201).json(order);
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    console.error('Order creation error:', error);
    res.status(500).json({ message: 'Failed to create order' });
  }
};

/**
 * GET /api/orders
 * Get all orders (admin only)
 */
const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
};

/**
 * GET /api/orders/:id
 * Get order by ID (public - for order confirmation page)
 */
const getOrderById = async (req, res) => {
  try {
    let order = await Order.findById(req.params.id);

    // Also try searching by order_number
    if (!order) {
      order = await Order.findOne({ order_number: req.params.id });
    }

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    if (error.name === 'CastError') {
      // If ID is not a valid ObjectId, try by order_number
      try {
        const order = await Order.findOne({ order_number: req.params.id });
        if (!order) return res.status(404).json({ message: 'Order not found' });
        return res.json(order);
      } catch {
        return res.status(404).json({ message: 'Order not found' });
      }
    }
    res.status(500).json({ message: 'Failed to fetch order' });
  }
};

/**
 * PUT /api/orders/:id/status
 * Update order status (admin only)
 */
const updateOrderStatus = async (req, res) => {
  const { status } = req.body;
  const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

  if (!status || !validStatuses.includes(status)) {
    return res.status(400).json({
      message: `Status must be one of: ${validStatuses.join(', ')}`,
    });
  }

  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json({ message: 'Order status updated', order });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.status(500).json({ message: 'Failed to update order status' });
  }
};

module.exports = { createOrder, getOrders, getOrderById, updateOrderStatus };
