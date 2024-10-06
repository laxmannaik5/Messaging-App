const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

//route to fetch all users
router.get('/', async (req, res) => {
    const users = await User.find().select('-password'); // Exclude passwords
    res.send(users);
  });  

router.post('/register', async (req, res) => {
const { username, password } = req.body;

  try {
      // Check if the username already exists
      const existingUser = await User.findOne({ username });
      if (existingUser) {
          return res.status(400).send({ message: 'Username is already taken.' });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
        
      const user = new User({ username, password: hashedPassword });
      await user.save();
      
      res.status(201).send({ message: 'User registered' });
  } catch (error) {
      console.error(error);
      res.status(500).send({ message: 'Internal Server Error' });
  }
});


router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).send({ message: 'Invalid credentials' });
  }
  const token = jwt.sign({ id: user._id }, 'secret', { expiresIn: '1h' });
  res.send({ token, userId: user._id, username: user.username });
});


module.exports = router;
