import React from 'react'
import { Link } from 'react-router-dom'

const MainMenu = () => {
  return (
    <div>
      This is Main
      <Link to="/customer">Go to Customer Page</Link>
      <Link to="/staff">Go to Staff Page</Link>
      <Link to="/admin">Go to Admin Page</Link>
    </div>
  )
}

export default MainMenu
