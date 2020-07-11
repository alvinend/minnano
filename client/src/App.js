import React from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom"
import Signin from './components/pages/auth/Signin'
import AdminRoutes from './routes/AdminRoutes'
import StaffRoutes from './routes/StaffRoutes'
import CustomerRoutes from './routes/CustomerRoutes'
import MainMenu from './components/pages/auth/MainMenu'

const App = () => {
  const [isAuth, setIsAuth] = React.useState(true)

  return isAuth ? (
    <Router>
      <Switch>
        <Route path="/admin">
          <AdminRoutes />
        </Route>
        <Route path="/staff">
          <StaffRoutes />
        </Route>
        <Route path="/customer">
          <CustomerRoutes />
        </Route>
        <Route path="/">
          <MainMenu />
        </Route>
      </Switch>
    </Router>
  ) : <Signin />
}

export default App;
