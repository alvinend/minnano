import express from 'express'
import mongoose from 'mongoose'
import bodyParser from 'body-parser'
import passport from 'passport'
import dotenv from 'dotenv'
import multer from 'multer'
import path from 'path'

if (process.env.NODE_ENV !== 'production') {
  dotenv.config()
}

import { userRouter } from 'routes/api/users'
import { customerRouter } from 'routes/api/customer'
import { staffRouter } from 'routes/api/staff'
import { adminRouter } from 'routes/api/admin'
import { awsRouter } from 'routes/api/aws'

import { passportConfig } from 'config/passport'

const app = express()

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
const db = process.env.MONGO_URI

// Connect to MongoDB
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
mongoose
  .connect(db!, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

// Passport middleware
app.use(passport.initialize());
app.use(express.static(path.join(__dirname, './client/build')));

// Passport Config
passportConfig(passport);

// Use Routes
app.use('/api/users', userRouter)
app.use('/api/customer', customerRouter)
app.use('/api/staff', staffRouter)
app.use('/api/admin', adminRouter)
app.use('/api/aws', awsRouter)
const port = process.env.PORT || 5000;

app.get('/test-var/:name', (req, res) => {
  res.send(process.env[req.params.name])
})

app.get('(/*)?', (req, res) => {
  res.sendFile(path.join(__dirname, './client/build/index.html'));
})

app.listen(port, () => console.log(`Server running on port ${port}`));
