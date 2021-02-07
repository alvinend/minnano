import * as React from 'react'
import styled from 'styled-components'
import { Button, Card, Form, Input, Select, Table, Space } from 'antd'
import axios from 'axios'
import { notifyAxiosError, notifySuccess } from 'models/notification'
import { IoIosTrash } from 'react-icons/io'
import { RiEditBoxLine } from 'react-icons/ri'
import { User } from 'models/common'
import { AlertModal } from 'components/organisms/AlertModal'
import { Modal } from 'components/organisms/Modal'
import { useTranslation } from 'react-i18next'

const AdminUserPageWrapper = styled.div`
  padding: 40px 0 40px 120px;
  width: calc(100% - 350px);
`

const HeadTitle = styled.h1`
  margin-bottom: 20px;
  font-size: 48px;
`

const InputTitle = styled.h3`
  font-size: 24px;
`

const InputDesc = styled.p`
  font-size: 14px;
  margin: 5px 0 15px 0;
`

const InputGroup = styled(Card)`
  margin-bottom: 30px;
`

export const AdminUserPage = () => {
  const [users, setUsers] = React.useState<User[]>([])
  const [deletingUser, setDeletingUser] = React.useState<User | null>(null)
  const [editingUser, setEditingUser] = React.useState<User | null>(null)
  const { t: rawT } = useTranslation('admin')

  const t = React.useCallback(
    (str: string) => rawT(`UserPage.${str}`),
    [rawT]
  )

  const fetchUsers = React.useCallback(
    async () => {
      try {
        const fetchedUsers = (await axios.get('/api/users/list')).data.users
        setUsers(fetchedUsers)
      } catch (e) {
        notifySuccess(e)
      }
    },
    []
  )

  React.useEffect(
    () => {
      fetchUsers()
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  const userData = React.useMemo(
    () => {
      return users.map(
        (user: any) => ({
          key: user._id,
          email: user.email,
          role: t(`API.${user.role}`)
        })
      )
    },
    [users, t]
  )

  const handleEditUser = React.useCallback(
    async (values: any) => {
      try {
        await axios.put(`/api/users/${editingUser?._id}`, values)
        notifySuccess('ユーザ変更しました')
        setEditingUser(null)
        fetchUsers()
      } catch (e) {
        notifyAxiosError(e)
      }
    },
    [editingUser, fetchUsers]
  )

  const onFinish = React.useCallback(
    async (values: any) => {
      try {
        await axios.post('/api/users/register', values)
        notifySuccess('ユーザの作成が成功しました')
        fetchUsers()
      } catch (e) {
        notifyAxiosError(e)
      }
    },
    [fetchUsers]
  )

  const handleDeletingUser = React.useCallback(
    (uuid: string) => {
      setDeletingUser(users.find(user => String(user._id) === String(uuid))!)
    },
    [users]
  )

  const handleEditingUser = React.useCallback(
    (uuid: string) => {
      setEditingUser(users.find(user => String(user._id) === String(uuid))!)
    },
    [users]
  )

  const handleDeleteUser = React.useCallback(
    async () => {
      try {
        await axios.delete(`/api/users/${deletingUser?._id}`)
        notifySuccess('ユーザ削除しました')
        setDeletingUser(null)
        fetchUsers()
      } catch (e) {
        notifyAxiosError(e)
      }
    },
    [deletingUser, fetchUsers]
  )

  const handleCancelAction = React.useCallback(
    () => {
      setDeletingUser(null)
      setEditingUser(null)
    },
    []
  )

  const columns = React.useMemo(
    () => [
      {
        title: t('Mail'),
        dataIndex: 'email',
        key: 'email'
      },
      {
        title: t('Role'),
        dataIndex: 'role',
        key: 'role'
      },
      {
        title: t('Action'),
        key: 'action',
        render: (_text: string, record: any) => (
          <Space size="middle">
            <span onClick={() => handleEditingUser(record.key)}><RiEditBoxLine /></span>
            <span onClick={() => handleDeletingUser(record.key)}><IoIosTrash /></span>
          </Space>
        ),
      },
    ],
    [handleDeletingUser, handleEditingUser, t]
  )

  return (
    <>
      <AdminUserPageWrapper>
        <HeadTitle>{t('User')}</HeadTitle>
        <InputGroup>
          <InputTitle>{t('Create User')}</InputTitle>
          <InputDesc>{t('Use for login and use application')}</InputDesc>
          <Form
            name="create-user"
            onFinish={onFinish}
          >
            <Form.Item
              label={t('Mail')}
              name="email"
              rules={[{ required: true, message: t('Please input your mail address') }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label={t('Password')}
              name="password"
              rules={[{ required: true, message: t('Please enter your password') }]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item
              label={t('Confirm Password')}
              name="password2"
              rules={[{ required: true, message: t('Please enter your password') }]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item
              label={t('Role')}
              name="role"
              rules={[{ required: true, message: t('Please select user\'s role') }]}
            >
              <Select>
                <Select.Option value="staff">
                  {t('Staff')}
                </Select.Option>
                <Select.Option value="admin">
                  {t('Admin')}
                </Select.Option>
              </Select>
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit">
                {t('Create User')}
              </Button>
            </Form.Item>
          </Form>
        </InputGroup>

        <InputGroup>
          <InputTitle>{t('Users List')}</InputTitle>
          <Table columns={columns} dataSource={userData} />
        </InputGroup>

      </AdminUserPageWrapper>

      <AlertModal
        isShowing={!!deletingUser}
        onSubmit={handleDeleteUser}
        onCancel={handleCancelAction}
      >
        <>
          {t('User')}
          <b>{deletingUser?.email}</b>
          、{t('Do you want to delete it?')}
        </>
      </AlertModal>
      <Modal
        isShowing={!!editingUser}
        onCancel={handleCancelAction}
        onSubmit={() => void 0}
        submitButtonProps={{
          children: t('Edit user'),
          type: 'submit',
          form: 'edit-user'
        }}
      >
        <Form
          id="edit-user"
          name="edit-user"
          onFinish={handleEditUser}
          initialValues={{
            ...editingUser!,
            password2: editingUser?.password
          }}
        >
          <Form.Item
            label={t('Mail')}
            name="email"
            rules={[{ required: true, message: t('Please input your mail address') }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label={t('Password')}
            name="password"
            rules={[{ required: true, message: t('Please enter your password') }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            label={t('Confirm Password')}
            name="password2"
            rules={[{ required: true, message: t('Please enter your password') }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            label={t('Role')}
            name="role"
            rules={[{ required: true, message: t('Please select user\'s role') }]}
          >
            <Select>
              <Select.Option value="staff">
                {t('Staff')}
              </Select.Option>
              <Select.Option value="admin">
                {t('Admin')}
              </Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}
