import { Router } from 'express'
import passport from 'passport'
import { validateCategoryInput } from 'validation/category'
import { Category } from 'models/Category'


const router = Router()

// @route   GET api/admin/category/test
// @desc    Test route
router.get('/test', (req, res) => res.json({ msg: 'Admin Category Works' }))

// @route   GET admin/category/
// @desc    Get categories
router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const categories = (await Category.find())!

      res.json({
        categories,
      })
    } catch (err) {
      return res.status(400).json(err)
    }
  }
)

// @route   POST api/admin/category
// @desc    Create new category
router.post(
  '/',
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

// @route   DELETE api/admin/category/:categoryid
// @desc    Delete specific item
router.delete(
  '/:categoryid',
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

// @route   PUT api/admin/category/:categoryid
// @desc    Edit specific category
router.put(
  '/:categoryid',
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

export const adminCategoryRouter = router
