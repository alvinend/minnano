import { Router } from 'express'
import { Item } from 'models/Item';
import { Order } from 'models/Order';
import { Subitem } from 'models/Subitem';
import { Table } from 'models/Table';

// Load Model

const router = Router()

// @route   GET api/customer/table/test
// @desc    Test route
router.get('/test', (req, res) => res.json({ msg: 'Customer Table Works' }));

// @route   POST api/customer/table/label/:label
// @desc    Initiate new table
router.post(
  '/label/:label',
  async (req, res) => {
    try {
      const newTable = new Table({
        label: req.params.label
      })
      const table = await newTable.save()
      return res.status(200).json(table)
    } catch (err) {
      return res.status(400).json(err)
    }
  }
)

// @route   PUT api/customer/table/:id/started
// @desc    Put table to started state
router.put(
  '/:id',
  async (req, res) => {
    try {
      const table = await Table.findByIdAndUpdate(
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

// @route   GET api/customer/table/:id
// @desc    Get all orders on table
router.get(
  '/:id',
  async (req, res) => {
    try {
      const rawTable = await Table.findById(req.params.id)

      // Insert Orders
      const table = rawTable!.toObject()
      const orders = await Promise.all(
        table.orderids.map(async (id: String) => {
          const order = (await Order.findById(id))

          const cart = await Promise.all(
            order!.cart.map(async content => {
              // Find Item or Subitem
              let item = {}
              let query
              let object
              query = await Item.findById(content.item)

              if (!query) {
                query = await Subitem.findById(content.item)
                object = query?.toObject()
                object.itemName = (await Item.findById(query?.itemid))?.name

                item = {
                  _id: query?._id,
                  type: 'subitem',
                  name: `${object.itemName} - ${object.name}`,
                  price: object.price
                }
              } else {
                object = query.toObject()
                item = {
                  _id: query?._id,
                  type: 'item',
                  name: `${object.name}`,
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
            created_at: order!.createdAt,
            cart
          }
        })
      )

      table.orders = orders
      delete table.orderids

      return res.status(200).json(table)
    } catch (err) {
      return res.status(400).json(err)
    }
  }
)

// @route    GET customer/table/:id/status
// @desc     Get table status by id
router.get(
  '/:id/status',
  async (req, res) => {
    try {
      const table = await Table.findById(req.params.id)
      return res.status(200).json({ status: table?.status })
    } catch (err) {
      return res.status(400).json(err)
    }
  }
)

export const customerTableRouter = router