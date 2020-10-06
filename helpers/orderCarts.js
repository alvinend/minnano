let orderCarts = []

function add (item) {
  orderCarts.push(item)
  return orderCarts
}

function remove (id) {
  orderCarts = orderCarts.filter(item => item.id !== id)
  return orderCarts
}

function get () {
  return orderCarts
}

module.exports = {
  add,
  remove,
  get
}