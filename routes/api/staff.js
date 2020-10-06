const express = require('express');
const router = express.Router();

const orderCarts = require('../../helpers/orderCarts')

// @route   GET api/staff/test
// @desc    Tests post route
router.get('/test', (req, res) => res.json({ msg: 'Staff Works' }));

// @route   GET api/staff/order
// @desc    Get Current Cart
router.get(
  '/order',
  (req, res) => {
    try {
      return res.status(200).json({ orderCarts: orderCarts.get() })
    } catch (err) {
      return res.status(400).json(err)
    }
  }
)

// @route   DELETE api/staff/order/:orderCartsid
// @desc    Delete Current Cart
router.delete(
  '/order/:orderCartsid',
  (req, res) => {
    try {
      return res.status(200).json({ orderCarts: orderCarts.remove(req.params.orderCartsid) })
    } catch (err) {
      return res.status(400).json(err)
    }
  }
)

module.exports = router;
