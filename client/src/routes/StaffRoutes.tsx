import React from 'react'
import { Switch, Route } from 'react-router-dom'
import { StaffPage } from '../components/pages/staff/StaffPage'
import { Loading } from '../components/atoms/Loading'
import axios from 'axios'
import { OrderCarts } from '../models/common'
import { toast } from 'react-toastify'
import { notifyAxiosError } from 'models/notification'
 
const StaffRoutes: React.FC = () => {
  const [isLoading, setIsLoading] = React.useState(true)
  const [orderCarts, setOrderCarts] = React.useState<OrderCarts>([])

  React.useEffect(
    () => {
      const init = async () => {
        try {
          setIsLoading(true)
          const res = await axios.get('/api/staff/order')
          setOrderCarts(res.data)
          setIsLoading(false)
        } catch (e) {
          notifyAxiosError(e)
        }
      }
      init()
    },
    []
  )

  const triggerFetch = React.useCallback(
    async () => {
      try {
        const res = await axios.get('/api/staff/order')
        setOrderCarts(res.data)
      } catch (e) {
        notifyAxiosError(e)
      }
      
    },
    []
  )

  const deleteOrder = React.useCallback(
    async cartid => {
      try {
        const res = await axios.delete(`/api/staff/order/${cartid}`)
        setOrderCarts(res.data)
      } catch (e) {
        notifyAxiosError(e)
      }
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
