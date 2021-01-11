import mongoose, { Schema, Document } from 'mongoose'

export type ITable = {
  id: string
  label: string
  orderids: string[]
  status: 'idle' | 'started' | 'pending' | 'finished' | 'canceled'
}

type ITableModel = ITable & Document

// Create Schema
const TableSchema = new Schema({
  label: {
    type: String,
    required: true
  },
  orderids: [{
    type: String,
    required: true
  }],
  status: {
    type: String,
    default: 'idle'
  }
})

export const Table = mongoose.model<ITableModel>('tables', TableSchema)
