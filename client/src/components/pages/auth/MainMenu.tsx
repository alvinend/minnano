import { Button } from 'antd'
import { color } from 'components/atoms/color'
import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { FaUserTie, FaKey, FaUserFriends } from 'react-icons/fa'

const MainMenuContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-image: url('https://minnanoonline.s3-ap-northeast-1.amazonaws.com/logo/2nd+Homepage+Background_00000.png');
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;

  & button {
    margin-top: 50px;
  }
`

const LinkContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  width: 80%;

  & a {
    margin: 20px;
  }
`

const StyledLink = styled(Link)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  width: 250px;
  height: 300px;
  padding: 20px 10px;
  background-color: ${color.white};
  font-size: 24px;
  font-weight: bold;
  color: #777;
  text-decoration: none;
  text-align: center;
  box-shadow: 5px 5px 10px 5px rgba(0,0,0,0.2);
  transition: box-shadow 0.3s ease-in-out;

  &:hover {
    box-shadow: 6px 6px 10px 6px rgba(0,0,0,0.3);
  }
`

const IconContainer = styled.span`
  font-size: 108px;
`

type iMainMenu = {
  onSignOut: () => void
  isAdmin: boolean
}

const MainMenu: React.FC<iMainMenu> = ({
  onSignOut,
  isAdmin
}) => {
  const { t } = useTranslation('mainmenu')

  return (
    <MainMenuContainer>
      <LinkContainer>
        <StyledLink to="/customer">
          <IconContainer>
            <FaUserFriends />
          </IconContainer>
          {t('CustomerLinkLabel')}
        </StyledLink>
        <StyledLink to="/staff">
          <IconContainer>
            <FaUserTie />
          </IconContainer>
          {t('StaffLinkLabel')}
        </StyledLink>
        {isAdmin && <StyledLink to="/admin">
          <IconContainer>
            <FaKey />
          </IconContainer>
          {t('AdminLinkLabel')}
        </StyledLink>}
      </LinkContainer>
      <Button
        size="large"
        danger={true}
        type="primary"
        onClick={onSignOut}
      >
        {t('LogoutButton')}
      </Button>
    </MainMenuContainer>
  )
}

export default MainMenu
