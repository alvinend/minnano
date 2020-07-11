const express = require('express');
const router = express.Router();

const cart = require('../../helpers/cart')

// @route   GET api/staff/test
// @desc    Tests post route
router.get('/test', (req, res) => res.json({ msg: 'Staff Works' }));

// @route   GET api/staff/order
// @desc    Get Current Cart
router.get(
  '/order',
  (req, res) => {
    try {
      return res.status(200).json({ cart: cart.get() })
    } catch (err) {
      return res.status(400).json(err)
    }
  }
)

// @route   DELETE api/staff/order/:cartid
// @desc    Delete Current Cart
router.delete(
  '/order/:cartid',
  (req, res) => {
    try {
      return res.status(200).json({ cart: cart.remove(req.params.cartid) })
    } catch (err) {
      return res.status(400).json(err)
    }
  }
)

module.exports = router;
