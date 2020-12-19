import { Router } from 'express'
import { Item } from 'models/Item'
import { Order } from 'models/Order'
import passport from 'passport'

const router = Router()

// @route   GET api/staff/test
// @desc    Tests post route
router.get('/test', (req, res) => res.json({ msg: 'Staff Works' }));

// @route   GET api/staff/order
// @desc    Get Current Cart
router.get(
  '/order',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const orders = await Order.find()
      const itemsData = await Item.find()

      const returnOrders = orders.map(order => {
        return {
          _id: order._id,
          label: order.label,
          cart: order.cart.map(content => {
            return {
              quantity: content.count,
              item: itemsData.find(itemData => {
                return itemData._id == content.item
              })
            }
          })
        }
      })

      return res.status(200).json(returnOrders)
    } catch (err) {
      return res.status(400).json(err)
    }
  }
)

// @route   DELETE api/staff/order/:orderCartsid
// @desc    Delete Current Cart
router.delete(
  '/order/:orderCartsid',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      await Order.findByIdAndDelete(req.params.orderCartsid)
      const orders = await Order.find()

      return res.status(200).json(orders)
    } catch (err) {
      return res.status(400).json(err)
    }
  }
)

export const staffRouter = router
