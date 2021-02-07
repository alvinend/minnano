import { UserContent } from 'apps/admin/components/organisms/UserContent'
import axios from 'axios'
import { notifyAxiosError, notifySuccess } from 'models/notification'
import * as React from 'react'
import { User } from 'models/common'

export const UserContentContainer: React.FC = () => {
  const fetchUsers = React.useCallback(
    async () => {
      try {
        const fetchedUsers = (await axios.get('/api/users/list')).data.users
        return fetchedUsers as User[]
      } catch (e) {
        notifyAxiosError(e)
        return []
      }
    },
    []
  )

  const updateUsers = React.useCallback(
    async (id: string, values: any) => {
      try {
        await axios.put(`/api/users/${id}`, values)
        notifySuccess('ユーザ変更しました')
        return (await fetchUsers())
      } catch (e) {
        notifyAxiosError(e)
        return []
      }
    },
    [fetchUsers]
  )

  const createUsers = React.useCallback(
    async (values: any) => {
      try {
        await axios.post('/api/users/register', values)
        notifySuccess('ユーザの作成が成功しました')
        return (await fetchUsers())
      } catch (e) {
        notifyAxiosError(e)
        return []
      }
    },
    [fetchUsers]
  )

  const deleteUsers = React.useCallback(
    async (id: string) => {
      try {
        await axios.delete(`/api/users/${id}`)
        notifySuccess('ユーザ削除しました')
        return (await fetchUsers())
      } catch (e) {
        notifyAxiosError(e)
        return []
      }
    },
    [fetchUsers]
  )

  return <UserContent
    fetchUsers={fetchUsers}
    updateUsers={updateUsers}
    createUsers={createUsers}
    deleteUsers={deleteUsers}
  />
}
