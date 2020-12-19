import mongoose, { Schema, Document } from 'mongoose'

export type ICategory = {
  id: string
  name: string
  desc?: string
  imageLink?: string
}

type ICategoryModel = ICategory & Document

// Create Schema
const CategorySchema = new Schema({
  name: {
    type: String,
    required: true
  },
  desc: String,
  imagelink: String
});

export const Category = mongoose.model<ICategoryModel>('categories', CategorySchema)
