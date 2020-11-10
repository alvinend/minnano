import * as React from 'react'
import styled from 'styled-components'
import { Modal } from 'components/organisms/Modal'
import { AdminInput } from 'components/atoms/input/AdminInput'
import Select from 'react-select'
import { Item } from 'models/common'
import { color } from 'components/atoms/color'

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

const ModalTitle = styled.div`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
`

const StyledSelect = styled(Select)`
  width: 445px;
  text-align: left;
`

const SubItemContainer = styled.div`
  background-color: ${color.gray};
  margin-top: 20px;
  padding: 20px;
  text-align: left;
`

const SubItemTitle = styled.h3`
  font-size: 18px;
  font-weight: bolder;
  margin-bottom: 20px;
`

type iAdminItemModal = {
  isShowing: boolean
  onSubmit: () => void
  onCancel: () => void
  itemData: Item | null
  onChangeItem: (e: any) => void
  categoryOptions: {
    label: string
    value: string
  }[]
  onChangeItemCategory: (selectedCategory: any) => void
  changeImage: (file: any) => void
}

export const AdminItemModal: React.FC<iAdminItemModal> = ({
  isShowing,
  onSubmit,
  onCancel,
  itemData,
  onChangeItem,
  categoryOptions,
  onChangeItemCategory,
  changeImage
}) => {

  const handleChangeFile = React.useCallback(
    e => {
      changeImage(e?.target?.files[0])
    },
    [changeImage]
  )

  return (
    <Modal
      isShowing={isShowing}
      onSubmit={onSubmit}
      onCancel={onCancel}
    >
      <ModalTitle>アイテム詳細編集</ModalTitle>
      <InputGroup>
        <InputDescGroup>
          <InputTitle>アイテム名</InputTitle>
          <InputDesc>品物の名前、メインに表示される</InputDesc>
        </InputDescGroup>
        <AdminInput
          placeholder="アイテム名"
          value={itemData?.name}
          name="name"
          onChange={onChangeItem}
        />
      </InputGroup>
      <InputGroup>
        <InputDescGroup>
          <InputTitle>説明</InputTitle>
          <InputDesc>何の品物かの説明</InputDesc>
        </InputDescGroup>
        <AdminInput
          placeholder="説明"
          value={itemData?.desc}
          name="desc"
          onChange={onChangeItem}
        />
      </InputGroup>
      <InputGroup>
        <InputDescGroup>
          <InputTitle>画像</InputTitle>
          <InputDesc>商品の画像</InputDesc>
        </InputDescGroup>
        <AdminInput
          placeholder="画像"
          name="imagelink"
          onChange={handleChangeFile}
          type="file"
        />
      </InputGroup>
      <InputGroup>
        <InputDescGroup>
          <InputTitle>価格</InputTitle>
          <InputDesc>品物の価格（円単位）</InputDesc>
        </InputDescGroup>
        <AdminInput
          placeholder="価格"
          value={itemData?.price}
          name="price"
          onChange={onChangeItem}
        />
      </InputGroup>
      <InputGroup>
        <InputDescGroup>
          <InputTitle>カテゴリ</InputTitle>
          <InputDesc>アイテムのカテゴリ</InputDesc>
        </InputDescGroup>
        <StyledSelect
          options={categoryOptions}
          value={categoryOptions.find(option => option.value === itemData?.categoryid)}
          onChange={onChangeItemCategory}
        />
      </InputGroup>

      {/* <SubItemContainer>
        <SubItemTitle>サブアイテム</SubItemTitle>
        <InputGroup>
          <InputDescGroup>
            <InputTitle>サブアイテム名</InputTitle>
            <InputDesc>サブアイテムの名前</InputDesc>
          </InputDescGroup>
          <AdminInput
            placeholder="サブアイテム名"
            value={itemData?.price}
            name="price"
            onChange={onChangeItem}
          />
        </InputGroup>
        <InputGroup>
          <InputDescGroup>
            <InputTitle>価格</InputTitle>
            <InputDesc>品物の価格（円単位）</InputDesc>
          </InputDescGroup>
          <AdminInput
            placeholder="価格"
            value={itemData?.price}
            name="price"
            onChange={onChangeItem}
          />
        </InputGroup>
        <InputGroup>
          <InputDescGroup>
            <InputTitle>価格</InputTitle>
            <InputDesc>品物の価格（円単位）</InputDesc>
          </InputDescGroup>
          <AdminInput
            placeholder="価格"
            value={itemData?.price}
            name="price"
            onChange={onChangeItem}
          />
        </InputGroup>
      </SubItemContainer> */}
    </Modal>
  )
}
