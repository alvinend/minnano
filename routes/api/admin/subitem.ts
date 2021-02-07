import { Router } from 'express'
import passport from 'passport'

// Validation

// Load Model


// Helpers
import { Subitem } from 'models/Subitem'
import { Item } from 'models/Item'

const router = Router()
// @route   GET api/admin/layout/test
// @desc    Test route
router.get('/test', (req, res) => res.json({ msg: 'Admin Subitem Works' }))

// @route   POST api/admin/subitem/:itemid
// @desc    Create new subitem on item
interface ISubItemRequest {
  name: string
  desc?: string
  price?: number
  stock?: number
}

router.post(
  '/item/:itemid',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    // @ts-ignore
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'No Permission' })
    }

    // TODO Validation

    try {
      const subItemRequest: ISubItemRequest = req.body
      const item = await Item.findById(req.params.itemid)
      if (!item) {
        res.status(404).json({ err: 'Data not found' })
      }

      const newSubitem = new Subitem({
        ...subItemRequest,
        itemid: item?._id
      })

      const subitem = await newSubitem.save()

      await item?.update({
        subitemids: [...item.subitemids, subitem._id]
      })

      return res.status(200).json(subitem)
    } catch (err) {
      return res.status(400).json(err)
    }
  }
)

// @route   PUT api/admin/subitem/:subitemid
// @desc    Update subitem

router.put(
  '/:subitemid',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    // @ts-ignore
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'No Permission' })
    }

    // TODO Validation

    try {
      const subitemRequest: ISubItemRequest = req.body

      const updatedSubitem = await Subitem.findOneAndUpdate(
        { _id: req.params.subitemid },
        { $set: subitemRequest },
        {
          new: true,
          useFindAndModify: false
        }
      )

      if (!updatedSubitem) {
        res.status(404).json({ err: 'Data not found' })
      }

      return res.status(200).json(updatedSubitem)
    } catch (err) {
      return res.status(400).json(err)
    }
  }
)

// @route   DELETE api/admin/subitem/:subitemid
// @desc    Create new subitem on item

router.delete(
  '/:subitemid',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    // @ts-ignore
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'No Permission' })
    }

    // TODO Validation

    try {
      const subitem = (await Subitem.findById(req.params.subitemid))!
      const item = (await Item.findById(subitem?.itemid))!

      if (!item) {
        res.status(404).json({ err: 'Data not found' })
      }

      item.subitemids = item.subitemids.filter(id => id !== subitem.id)
      await item.save()

      const deletedSubitem = await Subitem.findByIdAndDelete(req.params.subitemid)

      if (!deletedSubitem) {
        res.status(404).json({ err: 'Data not found' })
      }

      return res.status(200).json(deletedSubitem)
    } catch (err) {
      return res.status(400).json(err)
    }
  }
)

export const adminSubitemRouter = router