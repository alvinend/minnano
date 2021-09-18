import { Router } from 'express'
import { Item } from 'models/Item';

// Load Model
import { Order } from 'models/Order'
import { Subitem } from 'models/Subitem';
import { Table } from 'models/Table';

const router = Router()
// @route   GET api/customer/order/test
// @desc    Test route
router.get('/test', (req, res) => res.json({ msg: 'Customer Order Works' }));

// @route   POST api/customer/order
// @desc    Send order
router.post(
  '/',
  async (req, res) => {
    try {
      const tableid = req.body.tableid
      let table
      if (tableid) {
        table = await Table.findById(tableid)
      }

      const cart = req.body.cart.map((data: any) => {
        return {
          item: data.item._id,
          count: data.quantity
        }
      })

      const label = req.body.number

      // Update Stock
      for(const cartItem of cart) {
        const subItem = (await Subitem.findById(cartItem.item))
        let item

        if (!subItem) {
          item = (await Item.findById(cartItem.item))
        } else {
          item = (await Item.findById(subItem.itemid))
        }

        if (!item) {
          return res.status(500).json({error: 'Stock Check Failed'})
        }

        // Update Sub Item Stock
        if (subItem) {
          const subItemStock = (subItem?.stock || -1)

          if (subItemStock > 0) {
            if(subItemStock < cartItem.count) {
              return res.status(500).json({error: `${subItem.name} is out of stock`})
            }

            subItem.stock = Math.max(0, subItemStock - cartItem.count)
            
            try { await subItem.save() } catch { return res.status(500).json({error: 'Stock Update Failed'}) }
          }
        }

        // Update Item Stock
        const itemStock = (item?.stock || -1)
        
        if (itemStock > 0) {
          if(itemStock < cartItem.count) {
            return res.status(500).json({error: `${item.name} is out of stock`})
          }

          item.stock = Math.max(0, itemStock - cartItem.count)
          
          try { await item.save() } catch { return res.status(500).json({error: 'Stock Update Failed'}) }
        }
      }

      const order = new Order({
        cart,
        label,
        tableid: tableid || '',
        createdAt: new Date()
      })
      await order.save()

      // Adding Table's order if there is one

      if (table) {
        table.orderids = [...table.orderids, order._id]
        await table.save()
      }

      return res.status(200).json(order)
    } catch (err) {
      console.log(err)
      return res.status(400).json(err)
    }
  }
)

export const customerOrderRouter = router
