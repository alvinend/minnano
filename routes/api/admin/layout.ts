import { Router } from 'express'
import passport from 'passport'

// Validation
import { validateLayoutInput } from 'validation/layout'

// Load Model


// Helpers
import getLayout from 'helpers/getLayout'
import { Setting } from 'models/Setting'

const router = Router()
// @route   GET api/admin/layout/test
// @desc    Test route
router.get('/test', (req, res) => res.json({ msg: 'Admin Layout Works' }))

// @route   GET api/admin/layout
// @desc    Get Layout Setting
router.get(
  '/',
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
  '/',
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
        { layout: { ...layout, ...req.body } },
        { new: true }
      )

      return res.status(200).json(settings!.layout)
    } catch (err) {
      return res.status(400).json(err)
    }
  }
)

export const adminLayoutRouter = router