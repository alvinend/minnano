import mongoose, { Schema, Document } from 'mongoose'

export type ISetting = {
  name: string
  layout: {
    storename: string
    currency: string // Yen
    confirmation: {
      button: string
      desc: string
    }
    picking: {
      desc: string
      tableOverlay: {
        backButton: string // Back
        finishButton: string // Bill
      }
    }
    final: {
      button: string
      desc: string
      main: string
    }
    idle: {
      backgroundUrl: string
      greeting: string // Welcome to
      startButton: string // Start Order
    }
    waiting: {
      closing: string // Thank You
      instruction: string // Please proceed to cash register. Don't forget to take your belongings with you.
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
      default: 'Store Name'
    },
    currency: {
      type: String,
      default: 'USD'
    },
    confirmation: {
      desc: {
        type: String,
        default: 'Please check your order'
      },
      button: {
        type: String,
        default: 'Place Order'
      }
    },
    picking: {
      desc: {
        type: String,
        default: 'Pick a number, and wait for a call'
      },
      tableOverlay: {
        backButton: {
          type: String,
          default: 'Back'
        },
        finishButton: {
          type: String,
          default: 'Bill'
        }
      }
    },
    final: {
      main: {
        type: String,
        default: 'Thank you for your order'
      },
      desc: {
        type: String,
        default: 'Please wait a moment'
      },
      button: {
        type: String,
        default: 'Back to main menu'
      }
    },
    idle: {
      backgroundUrl: {
        type: String,
        default: 'https://minnanoonline.s3-ap-northeast-1.amazonaws.com/logo/Logo+Minnano+Desktop+Format.png'
      },
      greeting: {
        type: String,
        default: 'Welcome to'
      },
      startButton: {
        type: String,
        default: 'Start Order'
      }
    },
    waiting: {
      closing: {
        type: String,
        default: 'Thank You'
      },
      instruction: {
        type: String,
        default: 'Please proceed to cash register. Don\'t forget to take your belongings with you.'
      }
    }
  }
})

export const Setting = mongoose.model<ISettingModel>('settings', SettingSchema)
