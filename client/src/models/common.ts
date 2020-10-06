export type Item = {
  _id: string
  id: string
  name: string
  desc?: string,
  imagelink?: string,
  price: number,
  stock?: number,
  categoryid: string
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
    id: string
    cart: Cart
    number: number
}[]
