import axios from 'axios'
import * as React from 'react'
import { ItemContent } from 'apps/admin/components/organisms/ItemContent'
import { Category, Item, Subitem } from 'models/common'
import { notifyAxiosError, notifySuccess } from 'models/notification'

export const ItemContentContainer: React.FC = () => {
  const [categories, setCategories] = React.useState<Category[]>([])
  const [items, setItems] = React.useState<Item[]>([])
  const [isLoading, setIsLoading] = React.useState<boolean>(true)

  React.useEffect(
    () => {
      const init = async () => {
        try {
          setIsLoading(!isLoading)
          const res = await axios.get('/api/customer/info')
          setCategories(res.data.categories)
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

  return <ItemContent
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
}
