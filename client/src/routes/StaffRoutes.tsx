import React from 'react'
import { Switch, Route } from 'react-router-dom'
import { StaffPage } from '../components/pages/staff/StaffPage'
import { Loading } from '../components/atoms/Loading'
import axios from 'axios'
import { OrderCarts } from '../models/common'
 
const StaffRoutes: React.FC = () => {
  const [isLoading, setIsLoading] = React.useState(true)
  const [orderCarts, setOrderCarts] = React.useState<OrderCarts>([])

  React.useEffect(
    () => {
      const init = async () => {
        setIsLoading(true)
        const res = await axios.get('/api/staff/order')
        setOrderCarts(res.data.orderCarts)
        setIsLoading(false)
      }
      init()
    },
    []
  )

  const triggerFetch = React.useCallback(
    async () => {
      const res = await axios.get('/api/staff/order')
      setOrderCarts(res.data.orderCarts)
    },
    []
  )

  const deleteOrder = React.useCallback(
    async cartid => {
      const res = await axios.delete(`/api/staff/order/${cartid}`)
      setOrderCarts(res.data.orderCarts)
    },
    []
  )

  return isLoading ? <Loading /> : (
    <Switch>
      <Route path="/staff">
        <StaffPage
          orderCarts={orderCarts}
          triggerFetch={triggerFetch}
          deleteOrder={deleteOrder}
        />
      </Route>
    </Switch>
  )
}

export default StaffRoutes
