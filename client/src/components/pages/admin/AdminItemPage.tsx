import { color } from 'components/atoms/color'
import * as React from 'react'
import styled from 'styled-components'
import { ButtonPrimary } from 'components/atoms/button'
import { RiEditBoxLine } from 'react-icons/ri'
import { Category, Item } from 'models/common'
import { Modal } from 'components/organisms/Modal'
import { AdminInput } from 'components/atoms/input/AdminInput'
import Select from 'react-select'
import axios from 'axios'
import { IoIosTrash } from 'react-icons/io'
import { AlertModal } from 'components/organisms/AlertModal'
import { createNonNullExpression } from 'typescript'

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

const AdminItemPageContainer = styled.div`
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
  grid-template-columns: repeat(6, fit-content(100%));
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

const StyledSelect = styled(Select)`
  width: 445px;
  text-align: left;
`

type iAdminItemPage = {
  items: Item[]
  categories: Category[]
  updateItem: (editingItem: Item) => void
  deleteItem: (deletingItem: Item) => void
  createItem: (creatingItem: Item) => void
}

export const AdminItemPage:React.FC<iAdminItemPage> = ({
  items,
  categories,
  updateItem,
  deleteItem,
  createItem
}) => {
  const [editingItem, setEditingItem] = React.useState<Item | null>(null)
  const [deletingItem, setDeletingItem] = React.useState<Item | null>(null)
  const [creatingItem, setCreatingItem] = React.useState<Item>({} as Item)
  const [isCreatingItem, setIsCreatingItem] = React.useState<boolean>(false)

  const getCategoryName = React.useCallback(
    id => categories.find(category => category._id === id)?.name,
    [categories]
  )

  const handleCancelEditing = React.useCallback(
    () => {
      setEditingItem(null)
    },
    []
  )

  const handleConfirmEditing = React.useCallback(
    async () => {
      updateItem(editingItem as Item)
      setEditingItem(null)
    },
    [editingItem]
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
    () => setIsCreatingItem(false),
    []
  )

  const handleConfirmCreatingItem = React.useCallback(
    async () => {
      await createItem(creatingItem)
      setIsCreatingItem(false)
    },
    [creatingItem]
  )

  return (
    <>
      <AdminItemPageContainer>
        <HeadTitle>
          アイテムリスト
          <ButtonPrimary onClick={() => setIsCreatingItem(true)}>新規追加</ButtonPrimary>
        </HeadTitle>
        <OuterTableWrapper>
          <TableWrapper>
              <TableHeader>アイテム名</TableHeader>
              <TableHeader>説明</TableHeader>
              <TableHeader>画像</TableHeader>
              <TableHeader>価格</TableHeader>
              <TableHeader>カテゴリ</TableHeader>
              <TableHeader>アクション</TableHeader>
              {items.map(item => (
                <React.Fragment key={item._id}>
                  <TableItem>{item.name}</TableItem>
                  <TableItem>{item.desc}</TableItem>
                  <TableItem>{<img src={item.imagelink} />}</TableItem>
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
        <ButtonPrimary>設定変更</ButtonPrimary>
      </AdminItemPageContainer>

      {/* 編集モーダル */}
      <Modal
        isShowing={!!editingItem}
        onSubmit={handleConfirmEditing}
        onCancel={handleCancelEditing}
      >
        <ModalTitle>アイテム詳細編集</ModalTitle>
        <InputGroup>
          <InputDescGroup>
            <InputTitle>アイテム名</InputTitle>
            <InputDesc>品物の名前、メインに表示される</InputDesc>
          </InputDescGroup>
          <AdminInput
            placeholder="アイテム名"
            value={editingItem?.name}
            name="name"
            onChange={handleChangeEditingItem}
          />
        </InputGroup>
        <InputGroup>
          <InputDescGroup>
            <InputTitle>説明</InputTitle>
            <InputDesc>何の品物かの説明</InputDesc>
          </InputDescGroup>
          <AdminInput
            placeholder="説明"
            value={editingItem?.desc}
            name="desc"
            onChange={handleChangeEditingItem}
          />
        </InputGroup>
        <InputGroup>
          <InputDescGroup>
            <InputTitle>画像</InputTitle>
            <InputDesc>商品の画像</InputDesc>
          </InputDescGroup>
          <AdminInput
            placeholder="画像"
            value={editingItem?.imagelink}
            name="imagelink"
            onChange={handleChangeEditingItem}
          />
        </InputGroup>
        <InputGroup>
          <InputDescGroup>
            <InputTitle>価格</InputTitle>
            <InputDesc>品物の価格（円単位）</InputDesc>
          </InputDescGroup>
          <AdminInput
            placeholder="価格"
            value={editingItem?.price}
            name="price"
            onChange={handleChangeEditingItem}
          />
        </InputGroup>
        <InputGroup>
          <InputDescGroup>
            <InputTitle>カテゴリ</InputTitle>
            <InputDesc>アイテムのカテゴリ</InputDesc>
          </InputDescGroup>
          <StyledSelect
            options={categoryOptions}
            value={categoryOptions.find(option => option.value === editingItem?.categoryid)}
            onChange={handleChangeEditingItemCategory}
          />
        </InputGroup>
      </Modal>

      {/* 削除モーダル */}
      <AlertModal
        isShowing={!!deletingItem}
        onSubmit={handleConfirmDeleting}
        onCancel={handleCancelDeleting}
      >
        <>アイテム<b>{deletingItem?.name}</b>削除しますか？</>
      </AlertModal>

      {/* 作成モーダル */}
      <Modal
        isShowing={isCreatingItem}
        onSubmit={handleConfirmCreatingItem}
        onCancel={handleCancelCreatingItem}
      >
        <ModalTitle>アイテム詳細編集</ModalTitle>
        <InputGroup>
          <InputDescGroup>
            <InputTitle>アイテム名</InputTitle>
            <InputDesc>品物の名前、メインに表示される</InputDesc>
          </InputDescGroup>
          <AdminInput
            placeholder="アイテム名"
            value={creatingItem?.name}
            name="name"
            onChange={handleChangeCreatingItem}
          />
        </InputGroup>
        <InputGroup>
          <InputDescGroup>
            <InputTitle>説明</InputTitle>
            <InputDesc>何の品物かの説明</InputDesc>
          </InputDescGroup>
          <AdminInput
            placeholder="説明"
            value={creatingItem?.desc}
            name="desc"
            onChange={handleChangeCreatingItem}
          />
        </InputGroup>
        <InputGroup>
          <InputDescGroup>
            <InputTitle>画像</InputTitle>
            <InputDesc>商品の画像</InputDesc>
          </InputDescGroup>
          <AdminInput
            placeholder="画像"
            value={creatingItem?.imagelink}
            name="imagelink"
            onChange={handleChangeCreatingItem}
          />
        </InputGroup>
        <InputGroup>
          <InputDescGroup>
            <InputTitle>価格</InputTitle>
            <InputDesc>品物の価格（円単位）</InputDesc>
          </InputDescGroup>
          <AdminInput
            placeholder="価格"
            value={creatingItem?.price}
            name="price"
            onChange={handleChangeCreatingItem}
          />
        </InputGroup>
        <InputGroup>
          <InputDescGroup>
            <InputTitle>カテゴリ</InputTitle>
            <InputDesc>アイテムのカテゴリ</InputDesc>
          </InputDescGroup>
          <StyledSelect
            options={categoryOptions}
            value={categoryOptions.find(option => option.value === creatingItem?.categoryid)}
            onChange={handleChangeCreatingItemCategory}
          />
        </InputGroup>
      </Modal>
    </>
  )
}
