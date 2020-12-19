import mongoose, { Schema, Document } from 'mongoose'

// Role List
// 1. Admin
// 2. Staff

export type IUser  = {
  id: string
  email: string
  password: string
  role: string
}

type IUserModel = IUser & Document

// Create Schema
const UserSchema = new Schema<IUser>({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true
  }
})

export const User = mongoose.model<IUserModel>('users', UserSchema)
