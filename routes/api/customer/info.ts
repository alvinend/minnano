import { Router } from 'express'

// Load Model
import { Setting } from 'models/Setting'
import { Category } from 'models/Category'
import { Item } from 'models/Item'
import { Subitem } from 'models/Subitem'

const router = Router()
// @route   GET api/customer/info/test
// @desc    Test route
router.get('/test', (req, res) => res.json({ msg: 'Customer Info Works' }))

// @route   GET api/customer/info
// @desc    Get all Info
router.get(
  '/',
  async (req, res) => {
    try {
      const categories = (await Category.find())!
      const items = (await Item.find())!
      const setting = (await Setting.findOne({ name: 'layout' }))!

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
        categories,
        items: modifiedItems,
        layout: setting!.layout
      })
    } catch (err) {
      res.status(500).json(err)
    }
  }
)

export const customerInfoRouter = router
