const express = require('express');
const app = express();
const userRoutes = require('./routes/userRoutes');
const contentRoutes = require('./routes/contentRoutes');
const commentRoutes = require('./routes/commentRoutes');

app.use(express.json());

app.use('/users', userRoutes);
app.use('/contents', contentRoutes);
app.use('/comments', commentRoutes);

app.listen(3000, () => console.log('Server running on http://localhost:3000'));
