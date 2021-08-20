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
  justify-content: flex-end;
  height: 100vh;
  position: relative;

  & button {
    position: absolute;
    top: 20px;
    left: 20px;
    border-radius: 15px;
  }
`

const LinkContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  width: 100%;

  & a {
    margin: 40px 55px;
  }
`

const StyledLink = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  width: 254px;
  height: 90px;
  padding: 20px 10px;
  background-color: ${color.white};
  font-size: 24px;
  font-weight: bold;
  color: ${color.blue};
  text-decoration: none;
  text-align: center;
  box-shadow: 5px 5px 10px 5px rgba(0,0,0,0.2);
  transition: box-shadow 0.3s ease-in-out;
  border-radius: 25px;

  &:hover {
    box-shadow: 6px 6px 10px 6px rgba(0,0,0,0.3);
  }
`

const IconContainer = styled.span`
  font-size: 108px;
`

const VideoContainer = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  z-index: -1;
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
    <>
      <VideoContainer>
        <video autoPlay={true} loop={true} muted={true}>
          <source src="https://minnanoonline.s3.ap-northeast-1.amazonaws.com/mode_selector_video_high.mp4" type="video/mp4"/>
        </video>
      </VideoContainer>
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
    </>
  )
}

export default MainMenu
