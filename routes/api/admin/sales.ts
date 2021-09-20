import { Router } from 'express'
import passport from 'passport'
import { validateCategoryInput } from 'validation/category'
import { Category } from 'models/Category'
import { Order, OrderUtils } from 'models/Order'
import moment from 'moment'


const router = Router()

// @route   GET api/admin/sales/test
// @desc    Test route
router.get('/test', (req, res) => res.json({ msg: 'Admin Sales Works' }))

// @route   GET admin/sales/
// @desc    Get categories
router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      // const month = req.query?.month || moment().month()
      // const year = req.query?.year || moment().year()

      // console.log(month)
      // console.log(year)
      // console.log(moment('2021-08-01').startOf('month').month())

      // Daily Sales
      const today = moment()
      today.set({hour:0,minute:0,second:0,millisecond:0})

      const dailyOrders = await Order.find({
        createdAt: {
          $gte: today.toDate()
        }
      })

      const dailySales = await OrderUtils.getTotalPrice(dailyOrders)

      // Monthly Sales
      const startOfMonth = moment().startOf('month')
      startOfMonth.set({hour:0,minute:0,second:0,millisecond:0})
      const monthlyOrders = await Order.find({
        createdAt: {
          $gte: startOfMonth.toDate()
        }
      })

      const monthlySales = await OrderUtils.getTotalPrice(monthlyOrders)
      const productsSold = OrderUtils.getTotalQuantities(monthlyOrders)
      const transactionsCount = monthlyOrders.length

      // Sales
      const sales = [monthlySales]
      for (let i = 1; i < 6; i++) {
        const timeGte = moment().subtract(i, 'months').startOf('month')
        timeGte.set({hour:0,minute:0,second:0,millisecond:0})

        const timeLt = moment().subtract(i - 1, 'months').startOf('month')
        timeLt.set({hour:0,minute:0,second:0,millisecond:0})

        const orders = await Order.find({
          createdAt: {
            $gte: timeGte.toDate(),
            $lt: timeLt.toDate()
          }
        })

        sales.push((await OrderUtils.getTotalPrice(orders)))
      }

      res.json({
        dailySales,
        monthlySales,
        productsSold,
        transactionsCount,
        sales
      })
    } catch (err) {
      return res.status(400).json(err)
    }
  }
)

export const adminSalesRouter = router
