import mongoose, { Schema, Document } from 'mongoose'

export type ISetting = {
  name: string
  layout: {
    storename: string
    confirmation: {
      desc: string
      button: string
    }
    picking: {
      desc: string
    },
    final: {
      main: string,
      desc: string,
      button: string
    }
  }
}

type ISettingModel = ISetting & Document


// Create Schema
const SettingSchema = new Schema({
  name: {
    type: String,
    default: 'layout'
  },
  layout: {
    storename: {
      type: String,
      default: '店の名前'
    },
    confirmation: {
      desc: {
        type: String,
        default: '注文を確認してください'
      },
      button: {
        type: String,
        default: '注文確定'
      }
    },
    picking: {
      desc: {
        type: String,
        default: '番号カードを取り、入力してください'
      }
    },
    final: {
      main: {
        type: String,
        default: 'ありがとうございました'
      },
      desc: {
        type: String,
        default: '少々お待ちください。'
      },
      button: {
        type: String,
        default: 'メイン画面に戻る'
      }
    }
  }
})

export const Setting = mongoose.model<ISettingModel>('settings', SettingSchema)
