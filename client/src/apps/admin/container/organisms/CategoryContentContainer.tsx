import * as React from 'react'
import { Route } from 'react-router-dom'
import { CategoryContent } from 'apps/admin/components/organisms/CategoryContent'
import axios from 'axios'
import { notifyAxiosError, notifySuccess } from 'models/notification'
import { Category } from 'models/common'

export const CategoryContentContainer = () => {
  const [categories, setCategories] = React.useState<Category[]>([])
  const [isLoading, setIsLoading] = React.useState<boolean>(true)

  React.useEffect(
    () => {
      const init = async () => {
        try {
          setIsLoading(!isLoading)
          const res = await axios.get('/api/customer/info')
          setCategories(res.data.categories)
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


  return <CategoryContent
    categories={categories}
    updateCategory={updateCategory}
    createCategory={createCategory}
    deleteCategory={deleteCategory}
    uploadImage={uploadImage}
  />
}
