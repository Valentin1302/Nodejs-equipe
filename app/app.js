const express = require('express');
const app = express();
const userRoutes = require('./routes/userRoutes');
const contentRoutes = require('./routes/contentRoutes');
const commentRoutes = require('./routes/commentRoutes');
const authRoutes = require('./routes/authRoutes');

app.use(express.json());

app.use('/users', userRoutes);
app.use('/contents', contentRoutes);
app.use('/comments', commentRoutes); 
app.use('/', authRoutes);
app.get('/', (req, res) => {
  res.json({ message: 'Register route' });
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));


