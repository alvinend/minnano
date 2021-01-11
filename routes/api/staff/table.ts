import { Router } from 'express'
import { Table } from 'models/Table';
import passport from 'passport'

const router = Router()

// @route   GET api/staff/table/test
// @desc    Test route
router.get('/test', (req, res) => res.json({ msg: 'Staff Table Works' }))

// @route   GET staff/table/args
// @desc    Get table args by statuses
router.get(
  '/args',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const idleCount = await Table.count({ status: 'idle' })
      const startedCount = await Table.count({ status: 'started' })
      const pendingCount = await Table.count({ status: 'pending' })
      const completedCount = await Table.count({ status: 'finished' })
      const canceledCount = await Table.count({ status: 'canceled' })

      return res.status(200).json({
        idleCount,
        startedCount,
        pendingCount,
        completedCount,
        canceledCount
      })
    } catch (err) {
      return res.status(400).json(err)
    }
  }
)

// @route   GET staff/table
// @desc    Get table by status
router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const table = await Table.find(req.query)

      res.status(200).json(table)
    } catch (err) {
      return res.status(400).json(err)
    }
  }
)

// @route   PUT staff/table/:id
// @desc    Update table status by id
router.put(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const table = await Table.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        { new: true }
      )

      res.status(200).json(table)
    } catch (err) {
      return res.status(400).json(err)
    }
  }
)

export const staffTableRouter = router
