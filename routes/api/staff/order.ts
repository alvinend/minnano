import { Router } from 'express'
import { Item } from 'models/Item'
import { Order } from 'models/Order'
import { Subitem } from 'models/Subitem'
import passport from 'passport'

const router = Router()

// @route   GET api/staff/order/test
// @desc    Test route
router.get('/test', (req, res) => res.json({ msg: 'Staff Order Works' }));


// @route   GET staff/order/args
// @desc    Get order args by statuses
router.get(
  '/args',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const processingCount = await Order.find({ status: 'processing' }).countDocuments()
      const waitingCount = await Order.find({ status: 'waiting' }).countDocuments()
      const completedCount = await Order.find({ status: 'completed' }).countDocuments()
      const canceledCount = await Order.find({ status: 'canceled' }).countDocuments()

      return res.status(200).json({
        processingCount,
        waitingCount,
        completedCount,
        canceledCount
      })
    } catch (err) {
      return res.status(400).json(err)
    }

  }
)

// @route   PUT staff/order/:id
// @desc    Update order status by id
router.put(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const table = await Order.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        { new: true }
      )
      return res.status(200).json(table)
    } catch (err) {
      return res.status(400).json(err)
    }
  }
)

// @route   GET api/staff/order
// @desc    Get Current Cart
router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      // Filter order by request body
      const orders = await Order.find(req.query)

      const returnOrders = await Promise.all(
        orders.map(async order => {
          // Find Item or Subitem

          const cart = await Promise.all(
            order.cart.map(async content => {

              // Find Item or Subitem
              let item = {}
              let query
              let object
              query = await Item.findById(content.item)

              if (!query) {
                query = await Subitem.findById(content.item)
                object = query?.toObject()

                if (object) {
                  object.itemName = (await Item.findById(query?.itemid))?.name

                  item = {
                    _id: query?._id,
                    type: 'subitem',
                    name: `${object?.itemName} - ${object?.name}`,
                    price: object.price
                  }
                }

              } else {
                object = query.toObject()
                item = {
                  _id: query?._id,
                  type: 'item',
                  name: `${object?.name}`,
                  price: object.price
                }
              }


              return {
                quantity: content.count,
                item
              }
            })
          )

          return {
            ...order.toObject(),
            cart
          }
        })
      )

      return res.status(200).json(returnOrders)
    } catch (err) {
      console.log(err)
      return res.status(400).json(err)
    }
  }
)


export const staffOrderRouter = router
