const getStripe = () => {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('Stripe belum dikonfigurasi (STRIPE_SECRET_KEY kosong)');
  }
  return require('stripe')(process.env.STRIPE_SECRET_KEY);
};

const calculateOrderAmount = (shipping_fee, total_amount) => {
  return shipping_fee + total_amount;
};

const paymentController = async (req, res) => {
  const { cart, shipping_fee, total_amount, shipping } = req.body;

  try {
    const stripe = getStripe();
    const paymentIntent = await stripe.paymentIntents.create({
      amount: calculateOrderAmount(shipping_fee, total_amount),
      currency: 'idr',
      description: 'Paying for shopping',
      shipping,
    });
    return res.status(200).json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = paymentController;
