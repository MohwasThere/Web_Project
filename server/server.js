const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const port = 5000;

const mongoURI = 'mongodb+srv://mh798641_db_user:ehZjD3V8tYyTpvlo@webapp.9m6kngf.mongodb.net/?appName=Webapp';
app.use(cors());

async function connectToDatabase() {
  try {
    await mongoose.connect(mongoURI);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
}

connectToDatabase();

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});