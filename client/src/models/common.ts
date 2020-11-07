export type Item = {
  _id: string
  id: string
  name: string
  desc?: string
  imagelink?: string
  price: number
  stock?: number
  categoryid: string
  subitems: {
    id: string,
    name: string,
    desc?: string,
    price: number
  }[]
}

export type Category = {
  _id: string
  name: string,
  desc?: string,
  imagelink?: string
}

export type Cart = {
  item: Item
  quantity: number
}[]

export type OrderCarts = {
  _id: string
  cart: Cart
  label: string
}[]

export type User = {
  email: string,
  role: string
}