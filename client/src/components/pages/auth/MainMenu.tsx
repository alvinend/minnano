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
`

const LinkContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  width: 980px;
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

const MainMenu = () => {
  return (
    <MainMenuContainer>
      <LinkContainer>
        <StyledLink to="/customer">顧客画面</StyledLink>
        <StyledLink to="/staff">スタッフ画面</StyledLink>
        <StyledLink to="/admin">管理者画面</StyledLink>
      </LinkContainer>
    </MainMenuContainer>
  )
}

export default MainMenu
