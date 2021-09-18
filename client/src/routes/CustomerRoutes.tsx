import React, { useState } from 'react'
import { Switch, Route, useHistory } from 'react-router-dom'
import {
  CatalogPage,
  NumberPage,
  FinalPage,
  WaitingPage,
  IdlePage,
  ModeSelectorPage
} from '../components/pages/customer'
import axios from 'axios'
import { Loading } from '../components/atoms/Loading'
import { Cart, Category, Item, Layout, Table } from '../models/common'
import { notifyAxiosError } from 'models/notification'

const CustomerRoutes: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([])
  const [layout, setLayout] = useState<Layout>({} as Layout)
  const [cart, setCart] = useState<Cart>([])
  const [cartNumber, setCartNumber] = useState<string>('')
  const [items, setItems] = useState<Item[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [table, setTable] = useState<Table | undefined>(undefined)

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
        const res = await axios.post(
          '/api/customer/order',
          {
            cart,
            number,
            tableid: table ? table._id : ''
          }
        )
        history.push('/customer/final')
        setCartNumber(res.data.label)
        setupInitialInfo()
        setIsLoading(false)
      } catch (e) {
        notifyAxiosError(e)
      }
    },
    [cart, history, table]
  )

  const handleStartTable = React.useCallback(
    async (label: string) => {
      try {
        setIsLoading(true)
        const res = await axios.post(`/api/customer/table/label/${label}`)
        setTable(res.data)
        setIsLoading(false)
      } catch (e) {
        notifyAxiosError(e)
        setIsLoading(false)
      }
    },
    []
  )

  const resetTable = React.useCallback(
    async () => {
      try {
        setIsLoading(true)
        const res = await axios.post(`/api/customer/table/label/${table!.label}`)
        setTable(res.data)
        setIsLoading(false)
        history.push('/customer/idle')
      } catch (e) {
        notifyAxiosError(e)
        setIsLoading(false)
      }
    },
    [table, history]
  )

  const handleSetTableStatus = React.useCallback(
    async (status: string) => {
      try {
        if (table) {
          setIsLoading(true)
          const res = await axios.put(
            `/api/customer/table/${table?._id}`,
            { status }
          )
          setTable(res.data)
          setIsLoading(false)
        }
      } catch (e) {
        notifyAxiosError(e)
        setIsLoading(false)
      }
    },
    [table]
  )

  React.useEffect(
    () => {
      window.addEventListener('beforeunload', (event) => {
        event.preventDefault()
        event.returnValue = ''

        if (table) {
          axios.put(
            `/api/staff/table/${table._id}`, {
            status: 'finished'
          }
          )
        }
      })
    },
    [table]
  )

  const setupInitialInfo = React.useCallback(
    async () => {
      try {
        setIsLoading(true)
        const res = await axios.get('/api/customer/info')
        setCategories(res.data.categories)
        setLayout(res.data.layout)
        // setLayout(res.data.layout)
        setItems(res.data.items)
        setIsLoading(false)
      } catch (e) {
        notifyAxiosError(e)
      }
    },
    []
  )

  React.useEffect(
    () => {
      setupInitialInfo()
    },
    []
  )

  return isLoading ? <Loading /> : (
    <Switch>
      <Route path="/customer/pending">
        <WaitingPage
          resetState={resetState}
          resetTable={resetTable}
          layout={layout}
          table={table!}
        />
      </Route>

      <Route path="/customer/number">
        <NumberPage
          onSendOrder={handleSendOrder}
          layout={layout}
        />
      </Route>

      <Route path="/customer/final">
        <FinalPage
          cartNumber={cartNumber}
          resetState={resetState}
          layout={layout}
          table={table}
        />
      </Route>

      <Route path="/customer/catalog">
        <CatalogPage
          categories={categories}
          items={items}
          cart={cart}
          setCart={setCart}
          totalPrice={totalPrice}
          layout={layout}
          onSendOrder={handleSendOrder}
          onSetTableStatus={handleSetTableStatus}
          table={table}
        />
      </Route>

      <Route path="/customer/idle">
        <IdlePage
          onSetTableStatus={handleSetTableStatus}
          layout={layout}
          table={table}
        />
      </Route>

      <Route path="/">
        <ModeSelectorPage
          onSetTable={handleStartTable}
        />
      </Route>
    </Switch>
  )
}

export default CustomerRoutes
