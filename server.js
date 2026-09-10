require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 3000;

connectDB();

app.use(express.json());
app.use(cookieParser());

app.use('/auth', authRoutes);
app.use('/users', userRoutes);

app.use((req, res, next) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

app.use(errorHandler);

app.listen(PORT, () => {
   console.log(`Server running on port ${PORT}`);
});