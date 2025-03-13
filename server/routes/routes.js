const express = require('express');
const router = express.Router();
const Route = require('../models/Route');
const Location = require('../models/Location');

// Calculate distance between two points
function calculateDistance(source, destination) {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (destination.lat - source.lat) * Math.PI / 180;
  const dLon = (destination.lng - source.lng) * Math.PI / 180;
  
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
           Math.cos(source.lat * Math.PI / 180) * Math.cos(destination.lat * Math.PI / 180) * 
           Math.sin(dLon/2) * Math.sin(dLon/2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

// Generate transport options based on distance
function generateTransportOptions(distance, source, destination) {
  return [
    {
      type: 'bus',
      duration: Math.round(distance * 4), // 15 km/h average speed
      fare: Math.round(distance * 2), // ₹2 per km
      route: [source, 'Bus Stop A', 'Bus Stop B', destination]
    },
    {
      type: 'metro',
      duration: Math.round(distance * 2), // 30 km/h average speed
      fare: Math.round(10 + (distance * 2.5)), // Base fare ₹10 + ₹2.5 per km
      route: [source, 'Metro Station 1', 'Metro Station 2', destination]
    },
    {
      type: 'train',
      duration: Math.round(distance * 1.5), // 40 km/h average speed
      fare: Math.round(20 + (distance * 1.5)), // Base fare ₹20 + ₹1.5 per km
      route: [source, 'Railway Station 1', 'Railway Station 2', destination]
    }
  ];
}

// Generate ride-hailing options based on distance
function generateRideHailingOptions(distance) {
  return [
    {
      type: 'bike',
      provider: 'rapido',
      duration: Math.round(distance * 2), // 30 km/h average speed
      fare: Math.round(20 + (distance * 6)) // Base fare ₹20 + ₹6 per km
    },
    {
      type: 'auto',
      provider: 'uber',
      duration: Math.round(distance * 2.5), // 24 km/h average speed
      fare: Math.round(30 + (distance * 11)) // Base fare ₹30 + ₹11 per km
    },
    {
      type: 'car',
      provider: 'uber',
      duration: Math.round(distance * 2), // 30 km/h average speed
      fare: Math.round(50 + (distance * 14)) // Base fare ₹50 + ₹14 per km
    }
  ];
}

// Search routes
router.post('/search', async (req, res) => {
  try {
    const { source, destination } = req.body;
    
    if (!source || !destination) {
      return res.status(400).json({ message: 'Source and destination are required' });
    }

    // Find source and destination locations
    const [sourceLocation, destLocation] = await Promise.all([
      Location.findOne({ name: { $regex: source, $options: 'i' } }),
      Location.findOne({ name: { $regex: destination, $options: 'i' } })
    ]);

    if (!sourceLocation || !destLocation) {
      return res.status(404).json({ message: 'Location not found' });
    }

    const distance = calculateDistance(sourceLocation, destLocation);
    
    // Generate route options
    const routeData = {
      source,
      destination,
      transportOptions: generateTransportOptions(distance, source, destination),
      rideHailingOptions: generateRideHailingOptions(distance)
    };

    // Save route to database
    const route = new Route(routeData);
    await route.save();

    res.json(route);
  } catch (error) {
    console.error('Route search error:', error);
    res.status(500).json({ message: 'Failed to search routes' });
  }
});

module.exports = router;
