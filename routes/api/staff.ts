import express, { Router } from 'express'
import {
  staffTableRouter,
  staffOrderRouter
} from 'routes/api/staff/index'

const app = express()
const router = Router()

// @route   GET api/staff/test
// @desc    Test route
router.get('/test', (req, res) => res.json({ msg: 'Staff Works' }));

app.use('/', router)
app.use('/table', staffTableRouter)
app.use('/order', staffOrderRouter)

export const staffRouter = app
