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
  width: 280px;
  background-color: #202124;
  min-height: 100vh;
`

const SidebarLogo = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: flex-end;
  padding: 20px;
  font-size: 30px;
  color: ${color.white};
  font-weight: bold;
  word-break: break-all;
  text-align: right;
`

const SidebarItemContainer = styled.ul`
  border-top: 1px solid ${color.white};
  padding-top: 20px;
`

const SidebarItem = styled(Link)<{ selected?: boolean }>`
  display: flex;
  align-items: center;
  padding: 25px 30px;
  color: ${({ selected }) => selected ? color.black : color.white};
  font-size: 18px;
  background-color: ${({ selected }) => selected && color.primary};
  font-weight: bold;
  text-decoration: none;
  
  & svg {
    margin-right: 30px;
    font-size: 28px;
  }
`

type iAdminSidebar = {
  page: string
}

export const AdminSidebar: React.FC<iAdminSidebar> = ({
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
        MINNANO
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
