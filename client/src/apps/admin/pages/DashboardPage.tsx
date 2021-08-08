import * as React from 'react'
import { Route, Switch } from 'react-router-dom'
import { DashboardContentContainer } from '../container/organisms/DashboardContentContainer'
import { ItemContentContainer } from '../container/organisms/ItemContentContainer'

export const DashboardPage: React.FC = () => {
  return (
    <Switch>
      <Route path="/">
        <DashboardContentContainer />
      </Route>
    </Switch>
  )
}
