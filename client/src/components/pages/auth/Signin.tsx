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
  signin: (user: any) => void
}

const Signin:React.FC<iSignin> = ({
  signin
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
      signin({
        email,
        password
      })
    },
    [signin, email, password]
  )

  return (
    <SignupContainer>
      <Title>MinannO</Title>
      <Input
        label="メール"
        value={email}
        onChange={handleEmailInput}
        type="email"
      />
      <Input
        label="パスワード"
        value={password}
        onChange={handlePasswordInput}
        type="password"
      />
      <Button onClick={handleSignin}>サインイン</Button>
    </SignupContainer>
  )
}

export default Signin
