import express, { Router } from 'express'
import {
  adminCategoryRouter,
  adminItemRouter
} from 'routes/api/admin/index'
import { adminLayoutRouter } from './admin/layout'
import { adminSubitemRouter } from './admin/subitem'

const app = express()
const router = Router()

// @route   GET api/admin/test
// @desc    Tests post route
router.get('/test', (req, res) => res.json({ msg: 'Admin Works' }));

app.use('/', router)
app.use('/category', adminCategoryRouter)
app.use('/item', adminItemRouter)
app.use('/layout', adminLayoutRouter)
app.use('/subitem', adminSubitemRouter)
// app.use('/sales', adminSalesRouter)


export const adminRouter = app
