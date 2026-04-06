const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const api = require('../config/pterodactyl');

// Middleware auth
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
};

// GET - List available eggs
router.get('/eggs', async (req, res) => {
  try {
    const response = await api.get('/nests/1/eggs'); // Nest ID 1 biasanya default
    res.json({
      success: true,
      data: response.data.data.map(egg => ({
        id: egg.id,
        name: egg.name,
        description: egg.description,
        docker_image: egg.docker_image
      }))
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch eggs',
      details: error.response?.data || error.message 
    });
  }
});

// POST - Create server
router.post('/create', authenticateToken, async (req, res) => {
  try {
    const { name, description, egg, memory, disk, cpu, ports } = req.body;

    // Get nest and node info (adjust as needed)
    const nestResponse = await api.get('/nests');
    const nest = nestResponse.data.data[0]; // Use first nest

    // Create allocation
    const allocationResponse = await api.post('/allocations', {
      short: '',
      ip: '',
      ports: [ports || 25565]
    });

    // Create server
    const serverResponse = await api.post(`/nests/${nest.attributes.id}/servers`, {
      name,
      description: description || '',
      user: 1, // Admin user ID
      egg,
      docker_image: 'ghcr.io/pterodactyl/yolks:omega',
      startup: './server.jar\n-server-port=25565\nnogui',
      limits: {
        memory,
        disk,
        cpu,
        io: 500,
        rw: 0
      },
      feature_limits: {
        databases: 0,
        backups: 0,
        allocations: 0
      },
      allocation: {
        default: allocationResponse.data.attributes.id
      },
      deploy: {
        locations: [1], // Node location ID
        dedicated_ip: false,
        port_range: []
      },
      start_on_completion: true
    });

    res.json({
      success: true,
      data: serverResponse.data.attributes,
      message: 'Server created successfully!'
    });
  } catch (error) {
    console.error('Create server error:', error.response?.data);
    res.status(500).json({
      success: false,
      error: 'Failed to create server',
      details: error.response?.data || error.message
    });
  }
});

// GET - List user servers
router.get('/servers', authenticateToken, async (req, res) => {
  try {
    const response = await api.get('/users/1/servers'); // User ID 1
    res.json({
      success: true,
      data: response.data.data
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch servers'
    });
  }
});

module.exports = router;
