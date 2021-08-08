import { AdminSettingPage } from 'components/pages/admin/AdminSettingPage'
import * as React from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
import styled from 'styled-components'
import {
  CategoryPage,
  DashboardPage,
  ItemPage,
  UserPage
} from './pages'
import { SidebarContainer } from './container/organisms/SidebarContainer'
import { color } from 'components/atoms/color'

const AdminAppsContainer = styled.div`
  display: flex;
  background-color: ${color.gray};
`

const AdminContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: calc(100% - 256px);
  margin: 50px 0;
  align-items: center;
`

export const AdminApps: React.FC = () => {
  return (
    <AdminAppsContainer>
      <Route path="/admin/:page">
        <SidebarContainer />
      </Route>
      <AdminContentContainer>
        <Switch>
          <Route path="/admin/dashboard">
            <DashboardPage />
          </Route>
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
      </AdminContentContainer>
    </AdminAppsContainer>
  )
}
