import mongoose, { Schema, Document } from 'mongoose'

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
