import * as React from 'react'
import styled from 'styled-components'
import { Category, Item } from 'models/common'
import { Modal } from 'components/organisms/Modal'
import { AdminInput } from 'components/atoms/input/AdminInput'

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

type iAdminCategoryModal = {
  isShowing: boolean
  onSubmit: () => void
  onCancel: () => void
  categoryData: Category | null
  onChangeCategory: (e: any) => void
  changeImage: (file: any) => void
}


export const AdminCategoryModal: React.FC<iAdminCategoryModal> = ({
  isShowing,
  onSubmit,
  onCancel,
  categoryData,
  onChangeCategory,
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
      <ModalTitle>カテゴリ詳細編集</ModalTitle>
      <InputGroup>
        <InputDescGroup>
          <InputTitle>カテゴリ名</InputTitle>
          <InputDesc>品物の名前、メインに表示される</InputDesc>
        </InputDescGroup>
        <AdminInput
          placeholder="カテゴリ名"
          value={categoryData?.name}
          name="name"
          onChange={onChangeCategory}
        />
      </InputGroup>
      <InputGroup>
        <InputDescGroup>
          <InputTitle>説明</InputTitle>
          <InputDesc>何のカテゴリかの説明</InputDesc>
        </InputDescGroup>
        <AdminInput
          placeholder="説明"
          value={categoryData?.desc}
          name="desc"
          onChange={onChangeCategory}
        />
      </InputGroup>
      <InputGroup>
        <InputDescGroup>
          <InputTitle>画像</InputTitle>
          <InputDesc>カテゴリの画像</InputDesc>
        </InputDescGroup>
        <AdminInput
          type="file"
          name="imagelink"
          onChange={handleChangeFile}
        />
      </InputGroup>
    </Modal>
  )
}
