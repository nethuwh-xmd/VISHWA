// server.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();

// MongoDB Connection
mongoose.connect('mongodb+srv://vishwadb:VISHWA1@cluster0.v2vfqof.mongodb.net/Cluster0?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB error:', err));

// User Schema
const userSchema = new mongoose.Schema({
  name: String,
  grade: String,
  email: String,
  password: String
});

const User = mongoose.model('User', userSchema);

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public'))); // Serve index.html from /public

// Signup Route
app.post('/register', async (req, res) => {
  const { name, grade, email, password } = req.body;
  try {
    const existing = await User.findOne({ email });
    if (existing) {
      return res.json({ success: false, message: 'Email එක දැනටමත් register කරලා තියෙනවා!' });
    }

    const user = new User({ name, grade, email, password });
    await user.save();
    res.json({ success: true });
  } catch (err) {
    res.json({ success: false, message: 'DB error' });
  }
});

// Login Route
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email, password });
    if (user) {
      res.json({ success: true });
    } else {
      res.json({ success: false, message: 'Email හෝ Password එක වැරදියි!' });
    }
  } catch (err) {
    res.json({ success: false, message: 'DB error' });
  }
});

// Dashboard route (optional)
app.get('/dashboard', (req, res) => {
  res.send('<h1>Welcome to SMART EDUCATION Dashboard!</h1>');
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
