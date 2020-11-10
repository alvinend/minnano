import { Button } from 'antd'
import { color } from 'components/atoms/color'
import * as React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

const MainMenuContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: ${color.secondary};

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
  align-items: flex-end;
  justify-content: flex-end;
  width: 300px;
  height: 300px;
  padding: 0 10px;
  background-color: ${color.primary};
  font-size: 46px;
  font-weight: bold;
  color: ${color.white};
  text-decoration: none;
  text-align: right;
  box-shadow: 5px 5px 10px 5px rgba(0,0,0,0.2);
  transition: box-shadow 0.3s ease-in-out;

  &:hover {
    box-shadow: 6px 6px 10px 6px rgba(0,0,0,0.3);
  }
`

type iMainMenu = {
  onSignOut: () => void
  isAdmin: boolean
}

const MainMenu: React.FC<iMainMenu> = ({
  onSignOut,
  isAdmin
}) => {
  return (
    <MainMenuContainer>
      <LinkContainer>
        <StyledLink to="/customer">顧客画面</StyledLink>
        <StyledLink to="/staff">スタッフ画面</StyledLink>
        {isAdmin && <StyledLink to="/admin">管理者画面</StyledLink>}
      </LinkContainer>
      <Button
        size="large"
        danger={true}
        type="primary"
        onClick={onSignOut}
      >
        ログアウト
      </Button>
    </MainMenuContainer>
  )
}

export default MainMenu
