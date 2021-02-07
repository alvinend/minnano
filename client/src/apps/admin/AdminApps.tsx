import { AdminSettingPage } from 'components/pages/admin/AdminSettingPage'
import * as React from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
import styled from 'styled-components'
import {
  CategoryPage,
  ItemPage,
  UserPage
} from './pages'
import { SidebarContainer } from './container/organisms/SidebarContainer'

const AdminAppsContainer = styled.div`
  display: flex;
  background-color: #F4F4F7;
`

export const AdminApps: React.FC = () => {
  return (
    <AdminAppsContainer>
      <Route path="/admin/:page">
        <SidebarContainer />
      </Route>
      <Switch>
        <Route path="/admin/users">
          <UserPage />
        </Route>
        <Route path="/admin/settings">
          <AdminSettingPage />
        </Route>
        <Route path="/admin/categories">
          <CategoryPage />
        </Route>
        <Route path="/admin/items">
          <ItemPage />
        </Route>
        <Route path="/">
          <Redirect to="/admin/items" />
        </Route>
      </Switch>
    </AdminAppsContainer>
  )
}
