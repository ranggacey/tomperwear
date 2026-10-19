// Vercel serverless entry — semua /api/* lari ke sini.
// Koneksi mongoose di-cache antar invocation biar cold start tetap cepat.
const mongoose = require('mongoose');
const app = require('../server/app');

let connPromise = null;

async function dbConnect() {
  if (mongoose.connection.readyState === 1) return;
  if (!connPromise) {
    connPromise = mongoose
      .connect(process.env.DB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then((m) => m)
      .catch((err) => {
        connPromise = null;
        throw err;
      });
  }
  await connPromise;
}

module.exports = async (req, res) => {
  await dbConnect();
  return app(req, res);
};
