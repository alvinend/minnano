import { Button } from 'components/atoms/button'
import React from 'react'
import styled from 'styled-components'
import { Input } from '../../atoms/Input'
import { useTranslation } from 'react-i18next'
import { FrostedBox } from 'components/atoms/FrostedBox'
import { color } from 'components/atoms/color'

const SignupContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100vw;
  height: 100vh;
  background-image: url('https://minnanoonline.s3-ap-northeast-1.amazonaws.com/logo/Login+Homepage+Background_00000.png');
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
`

const SigninBox = styled(FrostedBox)`
  width: 500px;
  height: 80vh;
  border-radius: 0 20px 20px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  font-size: 24px;
  font-weight: bold;

  & > h1 {
    text-align: center;
    font-weight: 600;
    color: ${color.black};
    margin-bottom: 50px;
    font-size: 36px;
  }

  & > div {
    margin-bottom: 50px;
  }
`

const ImageBox = styled.div`
  width: 600px;
  height: 80vh;
  border-radius: 20px 0 0 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  font-size: 24px;
  font-weight: bold;
	box-shadow: 0 0 1rem 0 rgba(0, 0, 0, .2);
  background-color: #f9eac3;
  overflow: hidden;

  & img {
    width: 100%;
  }
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
      <ImageBox>
        <img src="https://minnanoonline.s3-ap-northeast-1.amazonaws.com/logo/Logo+Minnano.png" alt="Minnano Logo" />
      </ImageBox>

      <SigninBox>
        <h1>{t('Welcome Back')}</h1>
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
