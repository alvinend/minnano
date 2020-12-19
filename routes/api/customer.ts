import { Router } from 'express'

// Load Model
import { Setting } from '../../models/Setting'
import { Category } from '../../models/Category'
import { Item } from '../../models/Item'
import { Order } from '../../models/Order'

const router = Router();

// @route   GET api/customer/test
// @desc    Tests post route
router.get('/test', (req, res) => res.json({ msg: 'Customer Works' }));

// @route   GET api/customer/info
// @desc    Get all Info
router.get(
  '/info',
  async (req, res) => {
    try {
      const categories = await Category.find()
      const items = await Item.find()
      const setting = await Setting.findOne({ name: 'layout' })
      res.json({
        categories,
        items,
        layout: setting!.layout
      })
    } catch (err) {
      res.status(500).json(err)
    }
  }
)

// @route   POST api/customer/order
// @desc    Send order
router.post(
  '/order',
  async (req, res) => {
    try {
      const cart = req.body.cart.map((data: any) => {
        return {
          item: data.item._id,
          count: data.quantity
        }
      })

      const label = req.body.number
      const order = new Order({
        cart,
        label
      })
      await order.save()
      return res.status(200).json(order)
    } catch (err) {
      return res.status(400).json(err)
    }
  }
)

export const customerRouter = router
