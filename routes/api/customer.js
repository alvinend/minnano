const express = require('express');
const router = express.Router();
const passport = require('passport');

// Load Model
const Setting = require('../../models/Setting')
const Category = require('../../models/Category')
const Item = require('../../models/Item')
const Order = require('../../models/Order');

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
      const layout = await Setting.findOne({ name: 'layout' })
      res.json({ 
        categories,
        items,
        layout: layout.layout
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
      const cart = req.body.cart.map(cart => {
        return {
          item: cart.item._id,
          count: cart.quantity
        }
      })

      const label = req.body.number
      const order = new Order({
        cart,
        label
      })
      await order.save()
      console.log(order)
      return res.status(200).json(order)
    } catch (err) {
      return res.status(400).json(err)
    }
  }
)

module.exports = router;
