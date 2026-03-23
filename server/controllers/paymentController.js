import crypto from 'crypto';

// @desc    Create Razorpay order
// @route   POST /api/payment/create-order
export const createPaymentOrder = async (req, res) => {
  try {
    const { amount } = req.body;

    const keyId = process.env.RAZORPAY_KEY_ID || '';
    const keySecret = process.env.RAZORPAY_KEY_SECRET || '';

    // Dev mode: if keys are placeholders
    if (!keyId || keyId.startsWith('your_') || !keyId.startsWith('rzp_')) {
      return res.json({
        id: `demo_order_${Date.now()}`,
        amount: amount * 100,
        currency: 'INR',
        demo: true,
      });
    }

    // Production: create real Razorpay order
    const Razorpay = (await import('razorpay')).default;
    const razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });

    const order = await razorpay.orders.create({
      amount: amount * 100, // in paise
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
    });

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Verify payment
// @route   POST /api/payment/verify
export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    // Dev mode: auto-verify demo orders
    if (razorpay_order_id && razorpay_order_id.startsWith('demo_')) {
      return res.json({ verified: true });
    }

    const sign = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(sign)
      .digest('hex');

    if (expectedSignature === razorpay_signature) {
      res.json({ verified: true });
    } else {
      res.status(400).json({ verified: false, message: 'Payment verification failed' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
