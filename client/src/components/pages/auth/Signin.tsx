import { Button } from 'components/atoms/button'
import React from 'react'
import styled from 'styled-components'
import { Input } from '../../atoms/Input'
import { transparentize } from 'polished'
import { useTranslation } from 'react-i18next'

const SignupContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100vw;
  height: 100vh;
  background-image: url('https://minnanoonline.s3-ap-northeast-1.amazonaws.com/photo-1508796079212-a4b83cbf734d.webp');
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;

  & img {
    width: 300px;
    margin: -70px;
  }
`

const SigninBox = styled.div`
  width: 60vw;
  height: 80vh;
  border-radius: 20px;
  background-color: ${transparentize(0.5, '#4d3927')};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  margin-bottom: 20px;
  font-size: 24px;
  font-weight: bold;
`


type iSignin = {
  signin: (user: any) => void
}

const Signin: React.FC<iSignin> = ({
  signin
}) => {
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const { t } = useTranslation('signin')

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
      <SigninBox>
        <img src="https://minnanoonline.s3-ap-northeast-1.amazonaws.com/Minnano+Logo.png" alt="Minnano Logo" />
        <Input
          label={t('MailLabel')}
          value={email}
          onChange={handleEmailInput}
          type="email"
        />
        <Input
          label={t('PasswordLabel')}
          value={password}
          onChange={handlePasswordInput}
          type="password"
        />
        <Button onClick={handleSignin}>{t('SigninButton')}</Button>
      </SigninBox>
    </SignupContainer>
  )
}

export default Signin
