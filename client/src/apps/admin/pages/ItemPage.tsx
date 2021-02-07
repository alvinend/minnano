import * as React from 'react'
import { Route, Switch } from 'react-router-dom'
import { ItemContentContainer } from '../container/organisms/ItemContentContainer'

export const ItemPage: React.FC = () => {
  return (
    <Switch>
      <Route path="/">
        <ItemContentContainer />
      </Route>
    </Switch>
  )
}
