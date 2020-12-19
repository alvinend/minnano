import mongoose, { Schema, Document } from 'mongoose'

export type IOrder = {
  id: string
  cart: {
    item: string
    count: string
  }[]
  label: string
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
  // label = card number (C8) or table number (T2)
  label: String
})

export const Order = mongoose.model<IOrderModel>('orders', OrderSchema)
