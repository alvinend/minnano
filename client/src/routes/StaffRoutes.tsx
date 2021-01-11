import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import { StaffOrderPage } from '../components/pages/staff/StaffOrderPage'
import { StaffTablePage } from '../components/pages/staff/StaffTablePage'
import { Loading } from '../components/atoms/Loading'
import axios from 'axios'
import { OrderCart } from '../models/common'
import { notifyAxiosError } from 'models/notification'

const StaffRoutes: React.FC = () => {
  const [isLoading, setIsLoading] = React.useState(true)
  // eslint-disable-next-line
  const [orderCarts, setOrderCarts] = React.useState<OrderCart[]>([])

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
      <Route path="/staff/order">
        <StaffOrderPage
          deleteOrder={deleteOrder}
        />
      </Route>

      <Route path="/staff/table">
        <StaffTablePage />
      </Route>

      <Route path="/staff">
        <Redirect to="/staff/order" />
      </Route>
    </Switch>
  )
}

export default StaffRoutes
