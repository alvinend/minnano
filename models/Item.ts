import mongoose, { Schema, Document } from 'mongoose'

export type IItem = {
  id: string
  name: string
  desc?: string
  imageLink?: string
  price?: number
  stock?: number
  categoryid: string
  subitemids: string[]
}

type IItemModel = IItem & Document

// Create Schema
const ItemSchema = new Schema<IItem>({
  name: {
    type: String,
    required: true
  },
  desc: String,
  imagelink: String,
  price: Number,
  stock: Number,
  categoryid: {
    type: String,
    required: true
  },
  subitemids: {
    type: [String],
    default: []
  }
})

export const Item = mongoose.model<IItemModel>('items', ItemSchema)
