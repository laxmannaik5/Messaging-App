const express = require('express');
const Message = require('../models/Message');
const router = express.Router();

router.post('/', async (req, res) => {
  const { sender, recipient, text } = req.body;
  const message = new Message({ sender, recipient, text });
  await message.save();
  res.status(201).send(message);
});

router.get('/:senderId/:recipientId', async (req, res) => {
    const { senderId, recipientId } = req.params;
  
    try {
      const messages = await Message.find({
        $or: [
          { sender: senderId, recipient: recipientId },
          { sender: recipientId, recipient: senderId }
        ]
      }).sort({ createdAt: -1 }).limit(50);
  
      res.send(messages.reverse()); // Reverse to get the oldest messages first
    } catch (error) {
      console.error(error);
      res.status(500).send('Server Error');
    }
  });
  

module.exports = router;
