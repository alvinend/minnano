import { Router } from 'express'
import passport from 'passport'

// Validation
import { validateItemInput } from 'validation/item'

// Load Model
import { Item } from 'models/Item'
import { Subitem } from 'models/Subitem'

const router = Router()
// @route   GET api/admin/layout/test
// @desc    Test route
router.get('/test', (req, res) => res.json({ msg: 'Admin Item Works' }))

// @route   GET api/admin/item
// @desc    Get items
router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      // @ts-ignore
      if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'No Permission' })
      }
      const items = (await Item.find())!

      // Insert Sub Items
      const modifiedItems = await Promise.all(
        items.map(async rawItem => {
          const item = rawItem.toObject()
          const subitems = await Promise.all(
            item.subitemids.map(async (id: String) => {
              const subitem = (await Subitem.findById(id))?.toObject()
              subitem.itemName = item.name
              return subitem
            })
          )

          item.subitems = subitems
          delete item.subitemids

          return item
        })
      )
      res.json({
        items: modifiedItems,
      })
    } catch (err) {
      res.status(500).json(err)
    }
  }
)


// @route   POST api/admin/item
// @desc    Create new item
router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    // @ts-ignore
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'No Permission' })
    }
    const { errors, isValid } = await validateItemInput(req.body)

    if (!isValid) {
      return res.status(400).json(errors)
    }

    try {
      const newItem = new Item(req.body)
      const item = await newItem.save()
      return res.status(200).json(item)
    } catch (err) {
      return res.status(400).json(err)
    }
  }
)

// @route   DELETE api/admin/item/:itemid
// @desc    Delete specific item
router.delete(
  '/:itemid',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    // @ts-ignore
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'No Permission' })
    }
    try {
      const respond = {} as any
      if (req.params.itemid) {
        const deletedItem = await Item.findOneAndDelete({ _id: req.params.itemid })
        return res.status(200).json(deletedItem)
      } else {
        respond.error = 'Please Specify Item Id'
        return res.status(400).json(respond)
      }
    } catch (err) {
      return res.status(400).json(err)
    }
  }
)

// @route   PUT api/admin/item/:itemid
// @desc    Edit specific item
router.put(
  '/:itemid',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    // @ts-ignore
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'No Permission' })
    }
    const { errors, isValid } = await validateItemInput(req.body)

    if (!isValid) {
      return res.status(400).json(errors)
    }

    try {
      const respond = {} as any
      if (req.params.itemid) {
        const updatedItem = await Item.findOneAndUpdate(
          { _id: req.params.itemid },
          { $set: req.body },
          { new: true }
        )
        return res.status(200).json(updatedItem)
      } else {
        respond.error = 'Please Specify Item Id'
        return res.status(400).json(respond)
      }
    } catch (err) {
      return res.status(400).json(err)
    }
  }
)

// @router    GET api/admin/item/stock/args
// @desc      Get Overview of Stocks status
router.get(
  '/stock/args',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const goodStockCount = await Item.find({
        stock: { $gte: 10 }
      }).count()

      const warningStockCount = await Item.find({
        stock: {
          $lt: 10,
          $gt: 0
        }
      }).count()

      const outStockCount = await Item.find({
        stock: {
          $eq: 0
        }
      }).count()

      const unlimitedStockCount = await Item.find({
        $or: [
          { stock: { $eq: -1 } },
          { stock: undefined }
        ]
      }).count()

      const totalItemCount = await Item.find().count()

      res.json({
        goodStockCount,
        warningStockCount,
        outStockCount,
        unlimitedStockCount,
        totalItemCount
      })
    } catch (err) {
      return res.status(400).json(err)
    }
  }
)


// @router    GET api/admin/item/stocks
// @desc      Get List of Stock

export const adminItemRouter = router