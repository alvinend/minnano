import { color } from 'components/atoms/color'
import * as React from 'react'
import styled from 'styled-components'
import { ButtonPrimary } from 'components/atoms/button'
import { RiEditBoxLine } from 'react-icons/ri'
import { Category, Item, Subitem } from 'models/common'
import { IoIosTrash } from 'react-icons/io'
import { AlertModal } from 'components/organisms/AlertModal'
import { AdminItemModal } from 'components/organisms/AdminItemModal'
import { useTranslation } from 'react-i18next'

const AdminItemPageContainer = styled.div`
  padding: 40px 0 40px 120px;
  width: calc(90% - 350px);
  border: 1px solid ${color.lightGray};
  background: ${color.white};
`

const HeadTitle = styled.h1`
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  font-size: 48px;
`

const OuterTableWrapper = styled.div`
  overflow: auto;
`

const TableWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(6, auto);
  grid-auto-flow: row;
  margin-bottom: 30px;
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

type iAdminItemPage = {
  items: Item[]
  categories: Category[]
  updateItem: (editingItem: Item) => void
  deleteItem: (deletingItem: Item) => void
  createItem: (creatingItem: Item) => void
  uploadImage: (imageFile: any) => Promise<any>

  updateSubitem: (editingSubitem: Subitem) => Promise<Subitem[] | undefined>
  deleteSubitem: (deletingSubitem: Subitem) => Promise<Subitem[] | undefined>
  createSubitem: (creatingSubitem: Subitem) => Promise<Subitem[] | undefined>
}

export const AdminItemPage:React.FC<iAdminItemPage> = ({
  items,
  categories,
  updateItem,
  deleteItem,
  createItem,
  uploadImage,

  updateSubitem,
  deleteSubitem,
  createSubitem
}) => {
  const [editingItem, setEditingItem] = React.useState<Item | null>(null)
  const [deletingItem, setDeletingItem] = React.useState<Item | null>(null)
  const [creatingItem, setCreatingItem] = React.useState<Item>({} as Item)
  const [isCreatingItem, setIsCreatingItem] = React.useState<boolean>(false)
  const [image, setImage] = React.useState<any>(null)
  const { t: rawT } = useTranslation('admin')

  const t = React.useCallback(
    (str: string) => rawT(`ItemPage.${str}`),
    [rawT]
  )

  const getCategoryName = React.useCallback(
    id => categories.find(category => category._id === id)?.name,
    [categories]
  )

  const changeImage = React.useCallback(
    file => {
      setImage(file)
    },
    []
  )

  const handleCancelEditing = React.useCallback(
    () => {
      setImage(null)
      setEditingItem(null)
    },
    []
  )

  const handleConfirmEditing = React.useCallback(
    async () => {
      if (image) {
        const url = await uploadImage(image)
        editingItem!.imagelink = url
        setImage(null)
      }

      await updateItem(editingItem as Item)
      setEditingItem(null)
    },
    [editingItem, updateItem, image, uploadImage]
  )

  const handleEditItem = React.useCallback(
    (item: Item) => {
      setEditingItem(item)
    },
    []
  )

  const categoryOptions = React.useMemo(
    () => categories.map(category => {
      return {
        value: category._id,
        label: category.name
      }
    }),
    [categories]
  )

  const handleChangeEditingItem = React.useCallback(
    e => {
      // @ts-ignore
      editingItem[e.currentTarget.name] = e.currentTarget.value
      // @ts-ignore
      setEditingItem({...editingItem})
    },
    [editingItem]
  )

  const handleChangeEditingItemCategory = React.useCallback(
    selectedCategory => {
      // @ts-ignore
      editingItem.categoryid = selectedCategory.value
      // @ts-ignore
      setEditingItem({...editingItem})
    },
    [editingItem]
  )

  const handleConfirmDeleting = React.useCallback(
    async () => {
      await deleteItem(deletingItem as Item)
      setDeletingItem(null)
    },
    [deleteItem, deletingItem]
  )

  const handleCancelDeleting = React.useCallback(
    () => {
      setDeletingItem(null)
    },
    []
  )

  const handleChangeCreatingItem = React.useCallback(
    e => {
      // @ts-ignore
      creatingItem[e.currentTarget.name] = e.currentTarget.value
      // @ts-ignore
      setCreatingItem({...creatingItem})
    },
    [creatingItem]
  )

  const handleChangeCreatingItemCategory = React.useCallback(
    selectedCategory => {
      // @ts-ignore
      creatingItem.categoryid = selectedCategory.value
      // @ts-ignore
      setCreatingItem({...creatingItem})
    },
    [creatingItem]
  )

  const handleCancelCreatingItem = React.useCallback(
    () => {
      setImage(null)
      setIsCreatingItem(false)
    },
    []
  )

  const handleConfirmCreatingItem = React.useCallback(
    async () => {
      if (image) {
        const url = await uploadImage(image)
        creatingItem.imagelink = url
        setImage(null)
      }

      await createItem(creatingItem)
      setCreatingItem({} as Item)
      setIsCreatingItem(false)
    },
    [creatingItem, createItem, image, uploadImage]
  )

  return (
    <>
      <AdminItemPageContainer>
        <HeadTitle>
          {t('Items List')}
          <ButtonPrimary onClick={() => setIsCreatingItem(true)}>
            {t('Add Item')}
          </ButtonPrimary>
        </HeadTitle>
        <OuterTableWrapper>
          <TableWrapper>
              <TableHeader>{t('Item Name')}</TableHeader>
              <TableHeader>{t('Description')}</TableHeader>
              <TableHeader>{t('Image')}</TableHeader>
              <TableHeader>{t('Price')}</TableHeader>
              <TableHeader>{t('Category')}</TableHeader>
              <TableHeader>{t('Action')}</TableHeader>
              {items.map(item => (
                <React.Fragment key={item._id}>
                  <TableItem>{item.name}</TableItem>
                  <TableItem>{item.desc}</TableItem>
                  <TableItem>{<img src={item.imagelink} alt="item"/>}</TableItem>
                  <TableItem>{item.price}</TableItem>
                  <TableItem>{getCategoryName(item.categoryid)}</TableItem>
                  <TableItem>
                    <span onClick={() => handleEditItem({...item})}><RiEditBoxLine /></span>
                    <span onClick={() => setDeletingItem({...item})}><IoIosTrash /></span>
                  </TableItem>
                </React.Fragment>
              ))}
          </TableWrapper>
        </OuterTableWrapper>
      </AdminItemPageContainer>

      {/* 編集モーダル */}
      <AdminItemModal
        isShowing={!!editingItem}
        onSubmit={handleConfirmEditing}
        onCancel={handleCancelEditing}
        itemData={editingItem}
        onChangeItem={handleChangeEditingItem}
        categoryOptions={categoryOptions}
        onChangeItemCategory={handleChangeEditingItemCategory}
        changeImage={changeImage}
        type="update"
        updateSubitem={updateSubitem}
        createSubitem={createSubitem}
        deleteSubitem={deleteSubitem}
      />

      {/* 削除モーダル */}
      <AlertModal
        isShowing={!!deletingItem}
        onSubmit={handleConfirmDeleting}
        onCancel={handleCancelDeleting}
      >
        <>
          {t('Item Name')}
          <b>{deletingItem?.name}</b>
          {t('Do you want to delete it?')}
        </>
      </AlertModal>

      {/* 作成モーダル */}
      <AdminItemModal
        isShowing={isCreatingItem}
        onSubmit={handleConfirmCreatingItem}
        onCancel={handleCancelCreatingItem}
        itemData={creatingItem}
        onChangeItem={handleChangeCreatingItem}
        categoryOptions={categoryOptions}
        onChangeItemCategory={handleChangeCreatingItemCategory}
        changeImage={changeImage}
        type="create"
      />
    </>
  )
}
