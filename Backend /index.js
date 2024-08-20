const mongoose = require('mongoose');
require('dotenv').config();

const dbURI = process.env.MONGODB_URI;

mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Connected to MongoDB Atlas');
        mongoose.connection.close();
    })
    .catch(err => {
        console.error('Failed to connect to MongoDB Atlas:', err);
        process.exit(1);
    });
