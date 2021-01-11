import mongoose, { Schema, Document } from 'mongoose'

export type ISubitem = {
  id: string
  name: string
  desc?: string
  price?: number
  stock?: number
  itemid: string
}

type ISubitemModel = ISubitem & Document

// Create Schema
const SubitemSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  desc: String,
  price: Number,
  stock: Number,
  itemid: {
    type: String,
    required: true
  }
})

export const Subitem = mongoose.model<ISubitemModel>('subitems', SubitemSchema)
