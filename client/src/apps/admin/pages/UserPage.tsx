import * as React from 'react'
import { Route } from 'react-router-dom'
import { UserContentContainer } from '../container/organisms/UserContentContainer'

export const UserPage = () => {
  return (
    <>
      <Route path="/">
        <UserContentContainer />
      </Route>
    </>
  )
}
