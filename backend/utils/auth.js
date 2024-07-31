const jwt = require('jsonwebtoken');

const generateToken = (user) => {
  return jwt.sign({ id: user._id }, 'secret', { expiresIn: '1h' });
};

module.exports = { generateToken };
