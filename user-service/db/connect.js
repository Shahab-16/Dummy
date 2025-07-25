const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected for User Service');
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

module.exports = connectDB;
