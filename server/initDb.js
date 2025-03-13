const mongoose = require('mongoose');
const Location = require('./models/Location');

const sampleLocations = [
  { name: "Central Station", lat: 28.6304, lng: 77.2177 },
  { name: "Airport Terminal 3", lat: 28.5562, lng: 77.1000 },
  { name: "City Center Mall", lat: 28.6139, lng: 77.2090 },
  { name: "Tech Park", lat: 28.6129, lng: 77.2295 },
  { name: "University Campus", lat: 28.6519, lng: 77.2315 }
];

async function initializeDb() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/route-finder');
    console.log('Connected to MongoDB');

    // Clear existing locations
    await Location.deleteMany({});

    // Insert sample locations
    await Location.insertMany(sampleLocations);
    console.log('Sample locations inserted successfully');

    mongoose.disconnect();
  } catch (error) {
    console.error('Database initialization error:', error);
    process.exit(1);
  }
}

initializeDb();
