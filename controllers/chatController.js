const Message = require('../models/Message');
const OpenAI = require('openai');

const openai = new OpenAI(process.env.OPENAI_API_KEY);

exports.getMessages = async (req, res) => {
  try {
    const messages = await Message.find().populate('sender', 'username');
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.sendMessage = async (req, res) => {
  const { text } = req.body;
  try {
    const message = new Message({ text, sender: req.user.userId });
    await message.save();

    // Generate response using OpenAI GPT-3
    const response = await openai.Completion.create({
      engine: 'davinci',
      prompt: text,
      maxTokens: 150,
    });

    const botMessage = new Message({ text: response.choices[0].text, sender: req.user.userId });
    await botMessage.save();

    res.status(201).json({ message: 'Message sent successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};
