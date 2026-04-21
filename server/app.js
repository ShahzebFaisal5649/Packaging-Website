const express = require('express');
const cors = require('cors');
const errorHandler = require('./middleware/errorHandler');

const categoriesRouter = require('./routes/categories');
const subcategoriesRouter = require('./routes/subcategories');
const showcaseRouter = require('./routes/showcase');

const app = express();

app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173' }));
app.use(express.json());

app.use('/api/categories', categoriesRouter);
app.use('/api/subcategories', subcategoriesRouter);
app.use('/api/showcase', showcaseRouter);

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.use(errorHandler);

module.exports = app;
