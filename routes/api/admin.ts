import { Router } from 'express'

import { Setting } from 'models/Setting'
import { Category } from 'models/Category'
import { Item } from 'models/Item'
import { Subitem } from 'models/Subitem'

import { validateItemInput } from 'validation/item'
import { validateCategoryInput } from 'validation/category'
import { validateLayoutInput } from 'validation/layout'

import getLayout from 'helpers/getLayout'
import passport from 'passport'

const router = Router()

// @route   GET api/admin/test
// @desc    Tests post route
router.get('/test', (req, res) => res.json({ msg: 'Admin Works' }));

// @route   POST api/admin/category
// @desc    Create new category
router.post(
  '/category',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    // @ts-ignore
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'No Permission' })
    }

    const { errors, isValid } = validateCategoryInput(req.body)

    if (!isValid) {
      return res.status(400).json(errors)
    }

    try {
      const newCategory = new Category(req.body)
      const category = await newCategory.save()
      return res.status(200).json(category)
    } catch (err) {
      return res.status(400).json(err)
    }
  }
)

// @route   POST api/admin/item
// @desc    Create new item
router.post(
  '/item',
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

// @route   DELETE api/admin/category/:categoryid
// @desc    Delete specific item
router.delete(
  '/category/:categoryid',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    // @ts-ignore
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'No Permission' })
    }
    try {
      const respond = {} as any
      if (req.params.categoryid) {
        const deletedCategory = await Category.findOneAndDelete({ _id: req.params.categoryid })
        return res.status(200).json(deletedCategory)
      } else {
        respond.error = 'Please Specify Category Id'
        return res.status(400).json(respond)
      }
    } catch (err) {
      return res.status(400).json(err)
    }
  }
)

// @route   DELETE api/admin/item/:itemid
// @desc    Delete specific item
router.delete(
  '/item/:itemid',
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

// @route   PUT api/admin/category/:categoryid
// @desc    Edit specific category
router.put(
  '/category/:categoryid',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    // @ts-ignore
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'No Permission' })
    }
    const { errors, isValid } = validateCategoryInput(req.body)

    if (!isValid) {
      return res.status(400).json(errors)
    }

    try {
      const respond = {} as any
      if (req.params.categoryid) {
        const updatedCategory = await Category.findOneAndUpdate(
          { _id: req.params.categoryid },
          { $set: req.body },
          { new: true }
        )
        return res.status(200).json(updatedCategory)
      } else {
        respond.error = 'Please Specify Category Id'
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
  '/item/:itemid',
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

// @route   GET api/admin/layout
// @desc    Get Layout Setting
router.get(
  '/layout',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    // @ts-ignore
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'No Permission' })
    }
    try {
      const layout = await getLayout()
      return res.status(200).json(layout)
    } catch (err) {
      return res.status(400).json(err)
    }
})

// @route   PUT api/admin/layout
// @desc    Edit Layout Setting
router.put(
  '/layout',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    // @ts-ignore
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'No Permission' })
    }
    const { errors, isValid } = validateLayoutInput(req.body)

    if (!isValid) {
      return res.status(400).json(errors)
    }

    try {
      const layout = await getLayout()
      const settings = await Setting.findOneAndUpdate(
        { name: 'layout' },
        { layout: {...layout, ...req.body} },
        { new: true }
      )

      return res.status(200).json(settings!.layout)
    } catch (err) {
      return res.status(400).json(err)
    }
  }
)

// @route   POST api/admin/subitem/:itemid
// @desc    Create new subitem on item
interface ISubItemRequest {
  name: string
  desc?: string
  price?: number
  stock?: number
}

router.post(
  '/subitem/item/:itemid',
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
        subitemids: [ ...item.subitemids, subitem._id]
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
  '/subitem/:subitemid',
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
  '/subitem/:subitemid',
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

export const adminRouter = router
