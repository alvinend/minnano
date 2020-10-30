const express = require('express');
const router = express.Router();

const orderCarts = require('../../helpers/orderCarts');
const Item = require('../../models/Item');
const Order = require('../../models/Order');
const passport = require('passport')

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
      console.log(req.params.orderCartsid)
      await Order.findByIdAndDelete(req.params.orderCartsid)
      const orders = await Order.find()

      return res.status(200).json(orders)
    } catch (err) {
      return res.status(400).json(err)
    }
  }
)

module.exports = router;
