import React, { useState } from 'react'
import { Switch, Route, useHistory } from 'react-router-dom'
import {
  CatalogPage,
  NumberPage,
  FinalPage
} from '../components/pages/customer'
import axios from 'axios'
import { Loading } from '../components/atoms/Loading'
import { Cart, Category, Item } from '../models/common'

const CustomerRoutes: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([])
  // const [layout, setLayout] = useState({})
  const [cart, setCart] = useState<Cart>([])
  const [cartNumber, setCartNumber] = useState<string>('')
  const [items, setItems] = useState<Item[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)

  const history = useHistory()

  const totalPrice = React.useMemo(
    () => cart.length && cart
      .map(cartItem => cartItem.item.price * cartItem.quantity)
      .reduce((a, b) => a + b),
    [cart]
  )

  const resetState = React.useCallback(
    () => {
      setCart([])
    },
    []
  )

  const handleSendOrder = React.useCallback(
    async number => {
      try {
        setIsLoading(true)
        const res = await axios.post('/api/customer/order', { cart, number })
        history.push('/customer/final')
        setCartNumber(res.data.label)
        setIsLoading(false)
      } catch (e) {

      }
    },
    [cart, history]
  )

  React.useEffect(
    () => {
      const init = async () => {
        setIsLoading(true)
        const res = await axios.get('/api/customer/info')
        setCategories(res.data.categories)
        // setLayout(res.data.layout)
        setItems(res.data.items)
        setIsLoading(false)
      }

      init()
    },
    []
  )

  return isLoading ? <Loading />: (
    <Switch>
      <Route path="/customer/number">
        <NumberPage
          onSendOrder={handleSendOrder}
        />
      </Route>
      <Route path="/customer/final">
        <FinalPage
          cartNumber={cartNumber}
          resetState={resetState}
        />
      </Route>
      <Route path="/">
        <CatalogPage
          categories={categories}
          items={items}
          cart={cart}
          setCart={setCart}
          totalPrice={totalPrice}
        />
      </Route>
    </Switch>
  )
}

export default CustomerRoutes
