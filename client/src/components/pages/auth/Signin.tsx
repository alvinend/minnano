import { Button } from 'components/atoms/button'
import React from 'react'
import styled from 'styled-components'
import { color } from '../../atoms/color'
import { Input } from '../../atoms/Input'

const SignupContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100vw;
  height: 100vh;
  background-color: ${color.secondary};
`

const Title = styled.div`
  margin-bottom: 20px;
  font-size: 24px;
  font-weight: bold;
`


type iSignin = {
  setIsAuth: React.Dispatch<React.SetStateAction<boolean>>
}

const Signin:React.FC<iSignin> = ({
  setIsAuth
}) => {
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')

  const handleEmailInput = React.useCallback(
    e => {
      setEmail(e.currentTarget.value)
    },
    []
  )

  const handlePasswordInput = React.useCallback(
    e => {
      setPassword(e.currentTarget.value)
    },
    []
  )

  const handleSignin = React.useCallback(
    () => {
      setIsAuth(true)
    },
    [setIsAuth]
  )

  return (
    <SignupContainer>
      <Title>Please Sign in</Title>
      <Input
        label="Email"
        value={email}
        onChange={handleEmailInput}
        type="email"
      />
      <Input
        label="Password"
        value={password}
        onChange={handlePasswordInput}
        type="password"
      />
      <Button onClick={handleSignin}>Sign In</Button>
    </SignupContainer>
  )
}

export default Signin
