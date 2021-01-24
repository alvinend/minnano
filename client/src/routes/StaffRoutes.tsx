import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import { StaffOrderPage } from '../components/pages/staff/StaffOrderPage'
import { StaffTablePage } from '../components/pages/staff/StaffTablePage'

const StaffRoutes: React.FC = () => {
  return (
    <Switch>
      <Route path="/staff/order">
        <StaffOrderPage />
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
