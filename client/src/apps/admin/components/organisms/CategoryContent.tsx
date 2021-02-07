import { color } from 'components/atoms/color'
import * as React from 'react'
import styled from 'styled-components'
import { ButtonPrimary } from 'components/atoms/button'
import { RiEditBoxLine } from 'react-icons/ri'
import { Category, Item } from 'models/common'
import { IoIosTrash } from 'react-icons/io'
import { AlertModal } from 'components/organisms/AlertModal'
import { AdminCategoryModal } from 'components/organisms/AdminCategoryModal'
import { useTranslation } from 'react-i18next'

const CategoryContentWrapper = styled.div`
  padding: 40px 0 40px 120px;
  width: calc(100% - 350px);
`

const HeadTitle = styled.h1`
  display: flex;
  width: 90%;
  justify-content: space-between;
  margin-bottom: 20px;
  font-size: 48px;
`

const OuterTableWrapper = styled.div`
  overflow: auto;
`

const TableWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(4, auto);
  grid-auto-flow: row;
  width: 100%;
  min-width: 100%;
  margin-bottom: 30px;
  justify-items: stretch;
  align-items: stretch;
`

const TableHeader = styled.div`
  color: ${color.black};
  font-weight: bold;
  background-color: ${color.secondary};
  padding: 20px 30px;
`

const TableItem = styled.div`
  padding: 20px 30px;
  border-bottom: 1px solid ${color.secondary};

  & img {
    width: 100px;
  }

  & > span {
    padding: 0 10px;
  }
`

type iCategoryContent = {
  categories: Category[]
  updateCategory: (editingCategory: Category) => void
  deleteCategory: (deletingCategory: Category) => void
  createCategory: (creatingCategory: Category) => void
  uploadImage: (imageFile: any) => Promise<any>
}

export const CategoryContent: React.FC<iCategoryContent> = ({
  categories,
  updateCategory,
  deleteCategory,
  createCategory,
  uploadImage
}) => {
  const [editingCategory, setEditingCategory] = React.useState<Category | null>(null)
  const [deletingCategory, setDeletingCategory] = React.useState<Category | null>(null)
  const [creatingCategory, setCreatingCategory] = React.useState<Category>({} as Item)
  const [isCreatingCategory, setIsCreatingCategory] = React.useState<boolean>(false)
  const [image, setImage] = React.useState<any>(null)
  const { t: rawT } = useTranslation('admin')

  const t = React.useCallback(
    (str: string) => rawT(`CategoryPage.${str}`),
    [rawT]
  )

  const changeImage = React.useCallback(
    file => {
      setImage(file)
    },
    []
  )

  const handleCancelEditing = React.useCallback(
    () => {
      setEditingCategory(null)
    },
    []
  )

  const handleConfirmEditing = React.useCallback(
    async () => {
      if (image) {
        const url = await uploadImage(image)
        editingCategory!.imagelink = url
        setImage(null)
      }

      await updateCategory(editingCategory as Category)
      setEditingCategory(null)
    },
    [editingCategory, updateCategory, image, uploadImage]
  )

  const handleEditCategory = React.useCallback(
    (category: Category) => {
      setEditingCategory(category)
    },
    []
  )

  const handleChangeEditingCategory = React.useCallback(
    e => {
      // @ts-ignore
      editingCategory[e.currentTarget.name] = e.currentTarget.value
      // @ts-ignore
      setEditingCategory({ ...editingCategory })
    },
    [editingCategory]
  )

  const handleConfirmDeleting = React.useCallback(
    async () => {
      await deleteCategory(deletingCategory as Category)
      setDeletingCategory(null)
    },
    [deleteCategory, deletingCategory]
  )

  const handleCancelDeleting = React.useCallback(
    () => {
      setDeletingCategory(null)
    },
    []
  )

  const handleChangeCreatingCategory = React.useCallback(
    e => {
      // @ts-ignore
      creatingCategory[e.currentTarget.name] = e.currentTarget.value
      // @ts-ignore
      setCreatingCategory({ ...creatingCategory })
    },
    [creatingCategory]
  )

  const handleCancelCreatingCategory = React.useCallback(
    () => {
      setCreatingCategory({} as Item)
      setIsCreatingCategory(false)
    },
    []
  )

  const handleConfirmCreatingCategory = React.useCallback(
    async () => {
      if (image) {
        const url = await uploadImage(image)
        creatingCategory!.imagelink = url
        setImage(null)
      }

      await createCategory(creatingCategory)
      setCreatingCategory({} as Item)
      setIsCreatingCategory(false)
    },
    [creatingCategory, createCategory, image, uploadImage]
  )

  return (
    <>
      <CategoryContentWrapper>
        <HeadTitle>
          {t('Categories List')}
          <ButtonPrimary onClick={() => setIsCreatingCategory(true)}>
            {t('Add Category')}
          </ButtonPrimary>
        </HeadTitle>
        <OuterTableWrapper>
          <TableWrapper>
            <TableHeader>{t('Category Name')}</TableHeader>
            <TableHeader>{t('Description')}</TableHeader>
            <TableHeader>{t('Image')}</TableHeader>
            <TableHeader>{t('Action')}</TableHeader>
            {categories.map(category => (
              <React.Fragment key={category._id}>
                <TableItem>{category.name}</TableItem>
                <TableItem>{category.desc}</TableItem>
                <TableItem>{<img src={category.imagelink} alt="item" />}</TableItem>
                <TableItem>
                  <span onClick={() => handleEditCategory({ ...category })}><RiEditBoxLine /></span>
                  <span onClick={() => setDeletingCategory({ ...category })}><IoIosTrash /></span>
                </TableItem>
              </React.Fragment>
            ))}
          </TableWrapper>
        </OuterTableWrapper>
      </CategoryContentWrapper>

      {/* 編集モーダル */}
      <AdminCategoryModal
        isShowing={!!editingCategory}
        onSubmit={handleConfirmEditing}
        onCancel={handleCancelEditing}
        onChangeCategory={handleChangeEditingCategory}
        categoryData={editingCategory}
        changeImage={changeImage}
      />

      {/* 削除モーダル */}
      <AlertModal
        isShowing={!!deletingCategory}
        onSubmit={handleConfirmDeleting}
        onCancel={handleCancelDeleting}
      >
        <>
          {t('Category')}
          <b>{deletingCategory?.name}</b>
          {t('Do you want to delete it?')}
        </>
      </AlertModal>

      {/* 作成モーダル */}
      <AdminCategoryModal
        isShowing={isCreatingCategory}
        onSubmit={handleConfirmCreatingCategory}
        onCancel={handleCancelCreatingCategory}
        onChangeCategory={handleChangeCreatingCategory}
        categoryData={creatingCategory}
        changeImage={changeImage}
      />
    </>
  )
}
