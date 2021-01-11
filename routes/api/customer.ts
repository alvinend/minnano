import express, { Router } from 'express'

// Load Model
import {
  customerInfoRouter,
  customerOrderRouter,
  customerTableRouter
} from 'routes/api/customer/index'

const router = Router()

// @route   GET api/customer/table/test
// @desc    Test route
router.get('/test', (req, res) => res.json({ msg: 'Customer Works' }));


const app = express()

app.use('/', router)
app.use('/info', customerInfoRouter)
app.use('/order', customerOrderRouter)
app.use('/table', customerTableRouter)

export const customerRouter = app
