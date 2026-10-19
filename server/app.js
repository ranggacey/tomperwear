// Express app (tanpa listen) — dipakai serverless (api/index.js) & local dev (server/dev.js)
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const app = express();

// requiring routers
const paymentRouter = require('./routes/paymentRouter');
const productRouter = require('./routes/productRouter');
const adminRouter = require('./routes/adminRouter');
const orderRouter = require('./routes/orderRouter');
const uploadRouter = require('./routes/uploadRouter');

// requiring middlewares
const errorMiddleware = require('./middleware/Error');

// using middlewares
app.use(
  cors({
    origin: [/varuntiwari\.com$/, /netlify\.app$/, /localhost:\d{4}$/],
    credentials: true,
  })
);
app.use(express.json({ limit: '20mb' }));
app.use(cookieParser());

// basic api route
app.get('/api', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API service running 🚀',
  });
});

// using routers
app.use('/api/payment', paymentRouter);
app.use('/api/products', productRouter);
app.use('/api/admin', adminRouter);
app.use('/api/orders', orderRouter);
app.use('/api/upload', uploadRouter);

// using other middlewares
app.use(errorMiddleware);

module.exports = app;
