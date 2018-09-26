const express = require('express');
const app = express();
const mongoose = require('mongoose');
const morgan = require('morgan');
const config = require('./config/index');

// Routes -->
const buckets = require('./routes/api/v1/buckets');
const auth = require('./routes/api/v1/auth');
// <-- Routes

mongoose.connect(config.db.uri, { useNewUrlParser: true, useCreateIndex: true })
	.then(() => console.log('Database: Connected'))
	.catch(() => console.log('Database: Connection Failed'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

app.use('/api/v1/buckets', buckets);
app.use('/api/v1/auth', auth);

app.use((err, req, res, next) => {
	res.status(500).json({ success: false, err })
});

app.listen(config.PORT, () => console.log(`Listening for incoming requests..`));