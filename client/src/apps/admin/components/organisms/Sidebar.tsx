import { color } from 'components/atoms/color'
import * as React from 'react'
import styled from 'styled-components'
import {
  GoPackage,
  GoVersions,
  GoTools
} from 'react-icons/go'
import { FaUserFriends } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

const SidebarContainer = styled.div`
  width: 300px;
  background-color: #fff;
  min-height: 100vh;
  box-shadow: 0px 1px 8px rgba(0, 0, 0, 0.2), 0px 3px 3px rgba(0, 0, 0, 0.12), 0px 3px 4px rgba(0, 0, 0, 0.14);
`

const SidebarLogo = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  font-size: 30px;
  color: ${color.white};
  font-weight: bold;
  word-break: break-all;
  text-align: right;

  & img {
    width: 50%;
  }
`

const SidebarItemContainer = styled.ul`
  border-top: 1px solid ${color.gray};
  padding-top: 20px;
`

const SidebarItem = styled(Link) <{ selected?: boolean }>`
  display: flex;
  align-items: center;
  padding: 25px 30px;
  color: ${({ selected }) => selected ? color.black : color.black};
  font-size: 18px;
  background-color: ${({ selected }) => selected && color.primary};
  font-weight: bold;
  text-decoration: none;
  
  & svg {
    margin-right: 30px;
    font-size: 28px;
  }
`

type iSidebar = {
  page: string
}

export const Sidebar: React.FC<iSidebar> = ({
  page
}) => {
  const { t: rawT } = useTranslation('admin')

  const t = React.useCallback(
    (str: string) => rawT(`Sidebar.${str}`),
    [rawT]
  )

  return (
    <SidebarContainer>
      <SidebarLogo>
        <img src="https://minnanoonline.s3-ap-northeast-1.amazonaws.com/logo/Logo+Minnano+Transparant+Background+2.png" alt="Minnano Logo" />
      </SidebarLogo>
      <SidebarItemContainer>
        <SidebarItem selected={page === 'items'} to="/admin/items">
          <GoPackage />
          {t('Item')}
        </SidebarItem>

        <SidebarItem selected={page === 'categories'} to="/admin/categories">
          <GoVersions />
          {t('Category')}
        </SidebarItem>

        <SidebarItem selected={page === 'settings'} to="/admin/settings">
          <GoTools />
          {t('Settings')}
        </SidebarItem>

        <SidebarItem selected={page === 'users'} to="/admin/users">
          <FaUserFriends />
          {t('User')}
        </SidebarItem>
      </SidebarItemContainer>
    </SidebarContainer>
  )
}
