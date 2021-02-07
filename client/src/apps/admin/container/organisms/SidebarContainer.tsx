import * as React from 'react'
import { Sidebar } from 'apps/admin/components/organisms/Sidebar'
import { useParams } from 'react-router-dom'

export const SidebarContainer: React.FC = () => {
  const { page } = useParams() as any

  return <Sidebar page={page} />
}
