const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}
const users = require('./routes/api/users')
const customer = require('./routes/api/customer')
const staff = require('./routes/api/staff')
const admin = require('./routes/api/admin')
const aws = require('./routes/api/aws')
const multer = require('multer')

const app = express();

const multerMid = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
})

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())
app.use(multerMid.single('file'))
app.disable('x-powered-by')

// DB Config
const db = require('./config/keys').mongoURI;

// Connect to MongoDB
mongoose
  .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

// Passport middleware
app.use(passport.initialize());

// Passport Config
require('./config/passport')(passport);

// Use Routes
app.use('/api/users', users)
app.use('/api/customer', customer)
app.use('/api/staff', staff)
app.use('/api/admin', admin)
app.use('/api/aws', aws)
const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on port ${port}`));
