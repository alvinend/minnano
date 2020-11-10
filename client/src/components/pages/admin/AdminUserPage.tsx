import { color } from 'components/atoms/color'
import { AdminInput } from 'components/atoms/input/AdminInput'
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

const AdminUserPageContainer = styled.div`
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
    []
  )

  const userData = React.useMemo(
    () => {
      return users.map(
        (user: any) => ({
          key: user._id,
          email: user.email,
          role: user.role
        })
      )
    },
    [users]
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
    [editingUser]
  )

  const onFinish = React.useCallback(
    async (values: any) => {
      try{
        await axios.post('/api/users/register', values)
        notifySuccess('ユーザの作成が成功しました')
        fetchUsers()
      } catch (e) {
        notifyAxiosError(e)
      }
    },
    []
  )

  const handleDeletingUser = React.useCallback(
    (uuid: string) => {
      setDeletingUser(users.find(user => user._id == uuid)!)
    },
    [users]
  )

  const handleEditingUser = React.useCallback(
    (uuid: string) => {
      setEditingUser(users.find(user => user._id == uuid)!)
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
    [deletingUser]
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
        title: 'メール',
        dataIndex: 'email',
        key: 'email'
      },
      {
        title: 'ロール',
        dataIndex: 'role',
        key: 'role'
      },
      {
        title: 'アクション',
        key: 'action',
        render: (_text: string, record:any) => (
          <Space size="middle">
            <span onClick={() => handleEditingUser(record.key)}><RiEditBoxLine /></span>
            <span onClick={() => handleDeletingUser(record.key)}><IoIosTrash /></span>
          </Space>
        ),
      },
    ],
    [handleDeletingUser]
  )

  return (
    <>
      <AdminUserPageContainer>
        <HeadTitle>ユーザ</HeadTitle>
        <InputGroup>
          <InputTitle>ユーザ作成</InputTitle>
          <InputDesc>メニュー波面に表示されます</InputDesc>
          <Form
            name="create-user"
            onFinish={onFinish}
          >
            <Form.Item
              label="メール"
              name="email"
              rules={[{ required: true, message: 'メールを入力してください' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="パスワード"
              name="password"
              rules={[{ required: true, message: 'パスワードを入力してください' }]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item
              label="パスワード確認"
              name="password2"
              rules={[{ required: true, message: 'パスワードを入力してください' }]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item
              label="ロール"
              name="role"
              rules={[{ required: true, message: 'ロールを選択してください' }]}
            >
              <Select>
                <Select.Option value="staff">
                  Staff
                </Select.Option>
                <Select.Option value="admin">
                  Admin
                </Select.Option>
              </Select>
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit">
                ユーザ作成
              </Button>
            </Form.Item>
          </Form>
        </InputGroup>

        <InputGroup>
          <InputTitle>ユーザ一覧</InputTitle>
          <Table columns={columns} dataSource={userData} />
        </InputGroup>

      </AdminUserPageContainer>

      <AlertModal
        isShowing={!!deletingUser}
        onSubmit={handleDeleteUser}
        onCancel={handleCancelAction}
      >
        <>アイテム<b>{deletingUser?.email}</b>削除しますか？</>
      </AlertModal>
      <Modal
        isShowing={!!editingUser}
        onCancel={handleCancelAction}
        onSubmit={() => void 0}
        submitButtonProps={{
          children: 'abcd',
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
            label="メール"
            name="email"
            rules={[{ required: true, message: 'メールを入力してください' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="パスワード"
            name="password"
            rules={[{ required: true, message: 'パスワードを入力してください' }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            label="パスワード確認"
            name="password2"
            rules={[{ required: true, message: 'パスワードを入力してください' }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            label="ロール"
            name="role"
            rules={[{ required: true, message: 'ロールを選択してください' }]}
          >
            <Select>
              <Select.Option value="staff">
                Staff
              </Select.Option>
              <Select.Option value="admin">
                Admin
              </Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}
