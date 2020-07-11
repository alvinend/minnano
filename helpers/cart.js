let cart = []

function add (item) {
  cart.push(item)
  return cart
}

function remove (id) {
  cart = cart.filter(item => item.id !== id)
  return cart
}

function get () {
  return cart
}

module.exports = {
  add,
  remove,
  get
}