// Local dev entry: node server/dev.js
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const connectToDb = require('./config/db');
const app = require('./app');

process.on('uncaughtException', (err) => {
  console.log(`Error: ${err.message}`);
  process.exit(1);
});

connectToDb();

const server = app.listen(process.env.PORT || 5000, () => {
  console.log('Server running on port', process.env.PORT || 5000);
});

process.on('unhandledRejection', (err) => {
  console.log(`Error: ${err.message}`);
  server.close(() => process.exit(1));
});
