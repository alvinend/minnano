import { query } from 'express'
import mongoose, { Schema, Document } from 'mongoose'
import { Item } from './Item'
import { Subitem } from './Subitem'


export type IOrder = {
  id: string
  cart: {
    item: string
    count: string
  }[]
  label: string
  status: 'processing' | 'waiting' | 'completed' | 'canceled'
  tableid?: string
  createdAt: Date
  finishedAt: Date
}

type IOrderModel = IOrder & Document

// Create Schema
const OrderSchema = new Schema({
  cart: [{
    item: {
      type: String,
      required: true
    },
    count: {
      type: Number,
      required: true
    }
  }],
  status: {
    type: String,
    default: 'processing'
  },
  tableid: {
    type: String,
    default: ''
  },
  label: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: new Date()
  },
  finishedAt: {
    type: Date
  }
})

export const Order = mongoose.model<IOrderModel>('orders', OrderSchema)

const getTotalPrice = async (orders: IOrderModel[]) => {
  let totalPrice = 0

  for(const order of orders) {
    // Loop Cart in Order
    for(const obj of order.cart) {
      let query
      query = await Item.findById(obj.item)

      if (!query) {
        query = await Subitem.findById(obj.item)
      }

      totalPrice += (query?.toObject()?.price || 0) * Number(obj.count)
    }
  }

  return totalPrice
}

const getTotalQuantities = async (orders: IOrderModel[]) => {
  let total = 0

  for(const order of orders) {
    // Loop Cart in Order
    for(const obj of order.cart) {
      total += Number(obj.count)
    }
  }

  return total
}

export const OrderUtils = {
  getTotalPrice,
  getTotalQuantities
}
