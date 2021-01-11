import { Router } from 'express'

// Load Model
import { Order } from 'models/Order'
import { Table } from 'models/Table';

const router = Router()
// @route   GET api/customer/order/test
// @desc    Test route
router.get('/test', (req, res) => res.json({ msg: 'Customer Order Works' }));

// @route   POST api/customer/order
// @desc    Send order
router.post(
  '/',
  async (req, res) => {
    try {
      const tableid = req.body.tableid
      let table
      if (tableid) {
        table = await Table.findById(tableid)
      }

      const cart = req.body.cart.map((data: any) => {
        return {
          item: data.item._id,
          count: data.quantity
        }
      })

      const label = req.body.number
      const order = new Order({
        cart,
        label,
        tableid: tableid || '',
        createdAt: new Date()
      })
      await order.save()

      // Adding Table's order if there is one

      if (table) {
        table.orderids = [...table.orderids, order._id]
        await table.save()
      }

      return res.status(200).json(order)
    } catch (err) {
      console.log(err)
      return res.status(400).json(err)
    }
  }
)

export const customerOrderRouter = router
