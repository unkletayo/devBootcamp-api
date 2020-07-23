const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const colors = require('colors');
const errorHandler = require('./middleware/error')
const connectDB = require('./config/db');
// Load env vars
dotenv.config({ path: './config/config.env' });

// connect to db
connectDB();
// Route Files
const bootcamps = require('./routes/bootcamps');
const app = express();

// Body Parser
app.use(express.json())

// Dev logging middleware
if ((process.env.NODE_ENV = 'development')) {
  app.use(morgan('dev'));
}
// Mounting Routers
app.use('/api/v1/bootcamps', bootcamps);

app.use(errorHandler)

const PORT = process.env.PORT || 5000;

const server = app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
  )
);

// Handling unhandled promise rejections
process.on('unhandlesdRejection', (err, promise) => {
  console.log(`Error: ${err.message}`.red);
  // close server and exit
  server.close(() => process.exit(1));
});