const axios = require('axios');

const config = {
  baseURL: process.env.PTERODACTYL_URL + '/api/application',
  headers: {
    'Authorization': `Bearer ${process.env.PTERODACTYL_API_KEY}`,
    'Content-Type': 'application/json',
    'Accept': 'Application/vnd.pterodactyl.v1+json',
  }
};

const api = axios.create(config);

module.exports = api;
