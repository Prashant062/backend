const mongoose = require('mongoose');

const connectToMongo = async() => {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/inotebook', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // other options as needed
    });
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
  }
}
// Call the function to connect to MongoDB
connectToMongo();
module.exports = connectToMongo