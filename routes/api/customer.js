const express = require('express');
const router = express.Router();
const passport = require('passport');

// Load Model
const Setting = require('../../models/Setting')
const Category = require('../../models/Category')
const Item = require('../../models/Item')

const { v4: uuidv4 } = require('uuid')
const orderCarts = require('../../helpers/orderCarts')

// @route   GET api/customer/test
// @desc    Tests post route
router.get('/test', (req, res) => res.json({ msg: 'Customer Works' }));

// @route   GET api/customer/info
// @desc    Get all Info
router.get(
  '/info',
  // passport.authenticate('jwt', { session: false }),
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
  (req, res) => {
    try {
      return res.status(200).json({
        orderCarts: orderCarts.add({
          id: uuidv4(),
          cart: req.body.cart,
          number: req.body.number
        }),
        sentnumber: req.body.number
      })
    } catch (err) {
      return res.status(400).json(err)
    }
  }
)

module.exports = router;
