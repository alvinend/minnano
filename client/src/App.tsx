import React from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom"
import Signin from './components/pages/auth/Signin'
import StaffRoutes from './routes/StaffRoutes'
import CustomerRoutes from './routes/CustomerRoutes'
import MainMenu from './components/pages/auth/MainMenu'
import { User } from 'models/common'
import axios from 'axios'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { notifyAxiosError, notifySuccess } from 'models/notification'
import Cookies from 'js-cookie'
import { useTranslation } from 'react-i18next'
import 'antd/dist/antd.css'
import { AdminApps } from 'apps/admin/AdminApps'

const App = () => {
  // eslint-disable-next-line
  const [user, setUser] = React.useState<User | null>(null)

  const signin = React.useCallback(
    async ({ email, password }) => {
      try {
        const meta = await axios.post('/api/users/login', {
          email,
          password
        })
        const token = meta.data.token
        axios.defaults.headers.common['Authorization'] = token
        const user = (await axios.get('/api/users/current')).data
        setUser(user as User)
        Cookies.set('jwt', token)
        notifySuccess('Login was successful')
      } catch (e) {
        notifyAxiosError(e)
      }
    },
    []
  )

  const handleSignOut = React.useCallback(
    () => {
      Cookies.remove('jwt')
      setUser(null)
    },
    []
  )

  React.useEffect(
    () => {
      const checkToken = async () => {
        const token = Cookies.get('jwt')
        if (token) {
          try {
            axios.defaults.headers.common['Authorization'] = token
            const user = (await axios.get('/api/users/current')).data
            setUser(user as User)
          } catch (e) {
            notifyAxiosError(e)
          }
        }
      }

      checkToken()
    },
    []
  )

  const { i18n } = useTranslation()

  const isAdmin = React.useMemo(
    () => user?.role === 'admin',
    [user]
  )

  React.useEffect(
    () => {
      i18n.changeLanguage('en')
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  return <>
    <ToastContainer />
    {!!user ? (
      <Router>
        <Switch>
          <Route path="/admin">
            <AdminApps />
          </Route>
          <Route path="/staff">
            <StaffRoutes />
          </Route>
          <Route path="/customer">
            <CustomerRoutes />
          </Route>
          <Route path="/">
            <MainMenu onSignOut={handleSignOut} isAdmin={isAdmin} />
          </Route>
        </Switch>
      </Router>
    ) : <Signin
        signin={signin}
      />}
  </>
}

export default App;
