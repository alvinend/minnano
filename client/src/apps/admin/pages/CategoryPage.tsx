import * as React from 'react'
import { Route, Switch } from 'react-router-dom'
import { CategoryContentContainer } from '../container/organisms/CategoryContentContainer'

export const CategoryPage: React.FC = () => {
  return (
    <Switch>
      <Route path="/">
        <CategoryContentContainer />
      </Route>
    </Switch>
  )
}
