import * as React from 'react'
import styled from 'styled-components'
import { Button, Card, Form, Input, Select, Table, Space } from 'antd'
import { IoIosTrash } from 'react-icons/io'
import { RiEditBoxLine } from 'react-icons/ri'
import { User } from 'models/common'
import { AlertModal } from 'components/organisms/AlertModal'
import { Modal } from 'components/organisms/Modal'
import { useTranslation } from 'react-i18next'

const UserContentWrapper = styled.div`
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

type iUserContent = {
  fetchUsers: () => Promise<User[]>
  updateUsers: (id: string, values: any) => Promise<User[]>
  createUsers: (values: any) => Promise<User[]>
  deleteUsers: (id: string) => Promise<User[]>
}

export const UserContent: React.FC<iUserContent> = ({
  fetchUsers,
  updateUsers,
  createUsers,
  deleteUsers
}) => {
  const [users, setUsers] = React.useState<User[]>([])
  const [deletingUser, setDeletingUser] = React.useState<User | undefined>(undefined)
  const [editingUser, setEditingUser] = React.useState<User | undefined>(undefined)
  const { t: rawT } = useTranslation('admin')

  const t = React.useCallback(
    (str: string) => rawT(`UserPage.${str}`),
    [rawT]
  )

  React.useEffect(
    () => {
      const fetch = async () => {
        const users = await fetchUsers()
        setUsers(users)
      }
      fetch()
    },
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
      const users = await updateUsers(editingUser?._id || '', values)
      setEditingUser(undefined)
      setUsers(users)
    },
    [editingUser, updateUsers]
  )

  const onFinish = React.useCallback(
    async (values: any) => {
      const users = await createUsers(values)
      setUsers(users)
    },
    [createUsers]
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
      const users = await deleteUsers(deletingUser?._id || '')
      setDeletingUser(undefined)
      setUsers(users)
    },
    [deletingUser, fetchUsers]
  )

  const handleCancelAction = React.useCallback(
    () => {
      setDeletingUser(undefined)
      setEditingUser(undefined)
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
      <UserContentWrapper>
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

      </UserContentWrapper>

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
