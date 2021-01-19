import axios from 'axios'
import { AdminCategoryPage } from 'components/pages/admin/AdminCategoryPage'
import { AdminItemPage } from 'components/pages/admin/AdminItemPage'
import { AdminSettingPage } from 'components/pages/admin/AdminSettingPage'
import { AdminUserPage } from 'components/pages/admin/AdminUserPage'
import { AdminSidebar } from 'components/pages/admin/AdminSidebar'
import { Category, Item, Subitem } from 'models/common'
import * as React from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
import styled from 'styled-components'
import { notifyAxiosError, notifySuccess } from 'models/notification'

const AdminRoutesContainer = styled.div`
  display: flex;
  background-color: #ECECEC;
`

const AdminRoutes = () => {
  const [categories, setCategories] = React.useState<Category[]>([])
  // const [layout, setLayout] = React.useState({})
  const [items, setItems] = React.useState<Item[]>([])
  const [isLoading, setIsLoading] = React.useState<boolean>(true)

  React.useEffect(
    () => {
      const init = async () => {
        try {
          setIsLoading(!isLoading)
          const res = await axios.get('/api/customer/info')
          setCategories(res.data.categories)
          // setLayout(res.data.layout)
          setItems(res.data.items)
          setIsLoading(false)
        } catch (e) {
          notifyAxiosError(e)
        }
      }

      init()
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  const updateItem = React.useCallback(
    async (editingItem: Item) => {
      try {
        const res = await axios.put(`/api/admin/item/${editingItem?._id}`, editingItem)
        const newItem: Item = res.data
        const index = items.findIndex(item => item._id === newItem._id)
        const oldItem = items[index]
        items[index] = { ...oldItem, ...newItem }
        setItems([...items])
        notifySuccess('アイテムの更新が成功しました')
      } catch (e) {
        notifyAxiosError(e)
      }
    },
    [items]
  )

  const updateCategory = React.useCallback(
    async (editingCategory: Category) => {
      try {
        const res = await axios.put(`/api/admin/category/${editingCategory?._id}`, editingCategory)
        const newCategory: Category = res.data
        const index = categories.findIndex(category => category._id === newCategory._id)
        categories[index] = newCategory
        setCategories([...categories])
        notifySuccess('カテゴリの更新が成功しました')
      } catch (e) {
        notifyAxiosError(e)
      }
    },
    [categories]
  )

  const deleteItem = React.useCallback(
    async (deletingItem: Item) => {
      try {
        const res = await axios.delete(`/api/admin/item/${deletingItem?._id}`)
        const deletedItem = res.data
        const index = items.findIndex(item => item._id === deletedItem._id)
        items.splice(index, 1)
        setItems([...items])
        notifySuccess('アイテムの削除が成功しました')
      } catch (e) {
        notifyAxiosError(e)
      }
    },
    [items]
  )

  const deleteCategory = React.useCallback(
    async (deletingCategory: Category) => {
      try {
        const res = await axios.delete(`/api/admin/category/${deletingCategory?._id}`)
        const deletedCategory = res.data
        const index = categories.findIndex(category => category._id === deletedCategory._id)
        categories.splice(index, 1)
        setCategories([...categories])
        notifySuccess('カテゴリの削除が成功しました')
      } catch (e) {
        notifyAxiosError(e)
      }
    },
    [categories]
  )

  const createItem = React.useCallback(
    async (creatingItem: Item) => {
      try {
        const res = await axios.post(`/api/admin/item`, creatingItem)
        const createdItem = res.data
        items.unshift(createdItem)
        setItems([...items])
        notifySuccess('アイテムの作成が成功しました')
      } catch (e) {
        notifyAxiosError(e)
      }
    },
    [items]
  )

  const createCategory = React.useCallback(
    async (creatingCategory: Category) => {
      try {
        const res = await axios.post(`/api/admin/category`, creatingCategory)
        const createdCategory = res.data
        categories.unshift(createdCategory)
        setCategories([...categories])
        notifySuccess('カテゴリの作成が成功しました')
      } catch (e) {
        notifyAxiosError(e)
      }
    },
    [categories]
  )

  const uploadImage = React.useCallback(
    async (imageFile: any) => {
      try {
        const data = new FormData()
        data.append('file', imageFile)
        const res = await axios.post(`/api/aws/image`, data)
        return res?.data?.url
      } catch (e) {
        notifyAxiosError(e)
        return 'error'
      }
    },
    []
  )

  const updateSubitem = React.useCallback(
    async (editingSubitem: Subitem) => {
      try {
        const res = await axios.put(`/api/admin/subitem/${editingSubitem._id}`, editingSubitem)
        const newSubitem: Subitem = res.data
        const index = items.findIndex(item => item._id === newSubitem.itemid)
        const parentItem = items[index]

        parentItem.subitems = [
          ...parentItem.subitems.filter(subitem => subitem._id !== newSubitem._id),
          newSubitem
        ]

        items[index] = parentItem

        setItems([...items])
        notifySuccess('サブアイテムの更新が成功しました')

        return parentItem.subitems
      } catch (e) {
        notifyAxiosError(e)
      }
    },
    [items]
  )

  const deleteSubitem = React.useCallback(
    async (deletingSubitem: Subitem) => {
      try {
        await axios.delete(`/api/admin/subitem/${deletingSubitem._id}`)
        const index = items.findIndex(item => item._id === deletingSubitem.itemid)

        const parentItem = items[index]
        const newSubitems = parentItem.subitems.filter(subitem => subitem._id !== deletingSubitem._id)

        items[index] = {
          ...parentItem,
          subitems: newSubitems
        }

        setItems([...items])
        notifySuccess('サブアイテムの削除が成功しました')

        return newSubitems
      } catch (e) {
        notifyAxiosError(e)
      }
    },
    [items]
  )

  const createSubitem = React.useCallback(
    async (subitem: Subitem) => {
      try {
        const res = await axios.post(`/api/admin/subitem/item/${subitem.itemid}`, subitem)
        const newSubitem: Subitem = res.data
        const index = items.findIndex(item => item._id === newSubitem.itemid)
        const parentItem = items[index]

        parentItem.subitems.push(newSubitem)
        const newSubitems = parentItem.subitems

        items[index] = parentItem

        setItems([...items])
        notifySuccess('サブアイテムの削除が成功しました')

        return newSubitems
      } catch (e) {
        notifyAxiosError(e)
      }
    },
    [items]
  )


  return (
    <AdminRoutesContainer>
      <Switch>
        <Route path="/admin/users">
          <AdminSidebar page="users" />
          <AdminUserPage />
        </Route>
        <Route path="/admin/settings">
          <AdminSidebar page="settings" />
          <AdminSettingPage />
        </Route>
        <Route path="/admin/categories">
          <AdminSidebar page="categories" />
          <AdminCategoryPage
            categories={categories}
            updateCategory={updateCategory}
            createCategory={createCategory}
            deleteCategory={deleteCategory}
            uploadImage={uploadImage}
          />
        </Route>
        <Route path="/admin/items">
          <AdminSidebar page="items" />
          <AdminItemPage
            items={items}
            categories={categories}
            updateItem={updateItem}
            deleteItem={deleteItem}
            createItem={createItem}
            uploadImage={uploadImage}

            createSubitem={createSubitem}
            updateSubitem={updateSubitem}
            deleteSubitem={deleteSubitem}
          />
        </Route>
        <Route path="/">
          <Redirect to="/admin/items" />
        </Route>
      </Switch>
    </AdminRoutesContainer>
  )
}

export default AdminRoutes
