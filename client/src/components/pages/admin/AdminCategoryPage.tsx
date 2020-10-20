import { color } from 'components/atoms/color'
import * as React from 'react'
import styled from 'styled-components'
import { ButtonPrimary } from 'components/atoms/button'
import { RiEditBoxLine } from 'react-icons/ri'
import { Category, Item } from 'models/common'
import { Modal } from 'components/organisms/Modal'
import { AdminInput } from 'components/atoms/input/AdminInput'
import { IoIosTrash } from 'react-icons/io'
import { AlertModal } from 'components/organisms/AlertModal'

const InputTitle = styled.h3`
  font-size: 18px;
`

const InputDesc = styled.p`
  font-size: 12px;
  margin: 5px 0 15px 0;
`

const InputGroup = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const InputDescGroup = styled.div`
  flex-shrink: 0;
  margin-right: 30px;
  text-align: left;
`

const AdminCategoryPageContainer = styled.div`
  padding: 40px 0 40px 120px;
  background-color: #202124;
  width: 100%;
  color: ${color.white};
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
  grid-template-columns: repeat(4, fit-content(100%));
  grid-auto-flow: row;
  width: 90%;
  min-width: 800px;
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
  max-width: 300px;

  & img {
    width: 100px;
  }

  & > span {
    padding: 0 10px;
  }
`

const ModalTitle = styled.div`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
`

type iAdminCategoryPage = {
  categories: Category[]
  updateCategory: (editingCategory: Category) => void
  deleteCategory: (deletingCategory: Category) => void
  createCategory: (creatingCategory: Category) => void
}

export const AdminCategoryPage:React.FC<iAdminCategoryPage> = ({
  categories,
  updateCategory,
  deleteCategory,
  createCategory
}) => {
  const [editingCategory, setEditingCategory] = React.useState<Category | null>(null)
  const [deletingCategory, setDeletingCategory] = React.useState<Category | null>(null)
  const [creatingCategory, setCreatingCategory] = React.useState<Category>({} as Item)
  const [isCreatingCategory, setIsCreatingCategory] = React.useState<boolean>(false)

  const handleCancelEditing = React.useCallback(
    () => {
      setEditingCategory(null)
    },
    []
  )

  const handleConfirmEditing = React.useCallback(
    async () => {
      updateCategory(editingCategory as Category)
      setEditingCategory(null)
    },
    [editingCategory]
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
      setEditingCategory({...editingCategory})
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
      setCreatingCategory({...creatingCategory})
    },
    [creatingCategory]
  )

  const handleCancelCreatingCategory = React.useCallback(
    () => setIsCreatingCategory(false),
    []
  )

  const handleConfirmCreatingCategory = React.useCallback(
    async () => {
      await createCategory(creatingCategory)
      setIsCreatingCategory(false)
    },
    [creatingCategory]
  )

  return (
    <>
      <AdminCategoryPageContainer>
        <HeadTitle>
          カテゴリリスト
          <ButtonPrimary onClick={() => setIsCreatingCategory(true)}>新規追加</ButtonPrimary>
        </HeadTitle>
        <OuterTableWrapper>
          <TableWrapper>
              <TableHeader>カテゴリ名</TableHeader>
              <TableHeader>説明</TableHeader>
              <TableHeader>画像</TableHeader>
              <TableHeader>アクション</TableHeader>
              {categories.map(category => (
                <React.Fragment key={category._id}>
                  <TableItem>{category.name}</TableItem>
                  <TableItem>{category.desc}</TableItem>
                  <TableItem>{<img src={category.imagelink} />}</TableItem>
                  <TableItem>
                    <span onClick={() => handleEditCategory({...category})}><RiEditBoxLine /></span>
                    <span onClick={() => setDeletingCategory({...category})}><IoIosTrash /></span>
                  </TableItem>
                </React.Fragment>
              ))}
          </TableWrapper>
        </OuterTableWrapper>
      </AdminCategoryPageContainer>

      {/* 編集モーダル */}
      <Modal
        isShowing={!!editingCategory}
        onSubmit={handleConfirmEditing}
        onCancel={handleCancelEditing}
      >
        <ModalTitle>カテゴリ詳細編集</ModalTitle>
        <InputGroup>
          <InputDescGroup>
            <InputTitle>カテゴリ名</InputTitle>
            <InputDesc>品物の名前、メインに表示される</InputDesc>
          </InputDescGroup>
          <AdminInput
            placeholder="カテゴリ名"
            value={editingCategory?.name}
            name="name"
            onChange={handleChangeEditingCategory}
          />
        </InputGroup>
        <InputGroup>
          <InputDescGroup>
            <InputTitle>説明</InputTitle>
            <InputDesc>何のカテゴリかの説明</InputDesc>
          </InputDescGroup>
          <AdminInput
            placeholder="説明"
            value={editingCategory?.desc}
            name="desc"
            onChange={handleChangeEditingCategory}
          />
        </InputGroup>
        <InputGroup>
          <InputDescGroup>
            <InputTitle>画像</InputTitle>
            <InputDesc>カテゴリの画像</InputDesc>
          </InputDescGroup>
          <AdminInput
            placeholder="画像"
            value={editingCategory?.imagelink}
            name="imagelink"
            onChange={handleChangeEditingCategory}
          />
        </InputGroup>
      </Modal>

      {/* 削除モーダル */}
      <AlertModal
        isShowing={!!deletingCategory}
        onSubmit={handleConfirmDeleting}
        onCancel={handleCancelDeleting}
      >
        <>アイテム<b>{deletingCategory?.name}</b>削除しますか？</>
      </AlertModal>

      {/* 作成モーダル */}
      <Modal
        isShowing={isCreatingCategory}
        onSubmit={handleConfirmCreatingCategory}
        onCancel={handleCancelCreatingCategory}
      >
        <ModalTitle>アイテム詳細編集</ModalTitle>
        <InputGroup>
          <InputDescGroup>
            <InputTitle>アイテム名</InputTitle>
            <InputDesc>品物の名前、メインに表示される</InputDesc>
          </InputDescGroup>
          <AdminInput
            placeholder="アイテム名"
            value={creatingCategory?.name}
            name="name"
            onChange={handleChangeCreatingCategory}
          />
        </InputGroup>
        <InputGroup>
          <InputDescGroup>
            <InputTitle>説明</InputTitle>
            <InputDesc>何のカテゴリかの説明</InputDesc>
          </InputDescGroup>
          <AdminInput
            placeholder="説明"
            value={creatingCategory?.desc}
            name="desc"
            onChange={handleChangeCreatingCategory}
          />
        </InputGroup>
        <InputGroup>
          <InputDescGroup>
            <InputTitle>画像</InputTitle>
            <InputDesc>商品の画像</InputDesc>
          </InputDescGroup>
          <AdminInput
            placeholder="画像"
            value={creatingCategory?.imagelink}
            name="imagelink"
            onChange={handleChangeCreatingCategory}
          />
        </InputGroup>
      </Modal>
    </>
  )
}
