export type Item = {
  _id: string
  name: string
  desc?: string
  imagelink?: string
  price: number
  stock?: number
  categoryid: string
  subitems: Subitem[]
}

export type Category = {
  _id: string
  name: string,
  desc?: string,
  imagelink?: string
}

export type Cart = {
  item: Item | Subitem
  quantity: number
}[]

export type OrderCart = {
  _id: string
  cart: Cart
  label: string
  status: string
  createdAt: Date
}

export type User = {
  _id: string
  email: string
  role: string
  password: string
}

export type Layout = {
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
    greeting: string // Welcome to
    startButton: string // Start Order
  }
  waiting: {
    closing: string // Thank You
    instruction: string // Please proceed to cash register. Don't forget to take your belongings with you.
  }
}

export type Subitem = {
  _id: string
  name: string
  desc: string
  price: number
  stock: number
  itemid: string
  itemName?: string
}

export type Table = {
  _id: string
  label: string
  orderids: string[]
  status: string
}
