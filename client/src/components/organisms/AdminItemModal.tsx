import * as React from 'react'
import styled from 'styled-components'
import { Modal } from 'components/organisms/Modal'
import { AdminSubItemModal } from 'components/organisms/AdminSubItemModal'
import { AdminInput } from 'components/atoms/input/AdminInput'
import Select from 'react-select'
import { Item, Subitem } from 'models/common'
import { Button } from 'components/atoms/button'
import { useTranslation } from 'react-i18next'

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
  width: 300px;
  margin-right: 30px;
  text-align: left;
`

const ModalTitle = styled.div`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
`

const StyledSelect = styled(Select)`
  width: 100%;
  text-align: left;
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

  type: 'create' | 'update'
  updateSubitem?: (editingSubitem: Subitem) => Promise<Subitem[] | undefined>
  deleteSubitem?: (deletingSubitem: Subitem) => Promise<Subitem[] | undefined>
  createSubitem?: (creatingSubitem: Subitem) => Promise<Subitem[] | undefined>
}

export const AdminItemModal: React.FC<iAdminItemModal> = ({
  isShowing,
  onSubmit,
  onCancel,
  itemData,
  onChangeItem,
  categoryOptions,
  onChangeItemCategory,
  changeImage,

  type,
  updateSubitem,
  deleteSubitem,
  createSubitem
}) => {
  const [isShowingSub, setIsShowingSub] = React.useState(false)
  const { t: rawT } = useTranslation('admin')

  const t = React.useCallback(
    (str: string) => rawT(`ItemPage.${str}`),
    [rawT]
  )

  const handleChangeFile = React.useCallback(
    e => {
      changeImage(e?.target?.files[0])
    },
    [changeImage]
  )

  const isModalShowing = React.useMemo(
    () => isShowing && !isShowingSub,
    [isShowing, isShowingSub]
  )

  const handleCancelSubItem = React.useCallback(
    () => {
      setIsShowingSub(false)
      onCancel()
    },
    [onCancel]
  )

  const handleOpenSubItem = React.useCallback(
    () => {
      setIsShowingSub(true)
    },
    []
  )

  return (
    <>
      <Modal
        isShowing={isModalShowing}
        onSubmit={onSubmit}
        onCancel={onCancel}
      >
        <ModalTitle>
          {type === 'create' ? 'Create Item' : 'Edit Item Details'}
        </ModalTitle>
        <InputGroup>
          <InputDescGroup>
            <InputTitle>{t('Item Name')}</InputTitle>
            <InputDesc>{t('Name of Item, Will mainly be display')}</InputDesc>
          </InputDescGroup>
          <AdminInput
            placeholder={t('Item Name')}
            value={itemData?.name}
            name="name"
            onChange={onChangeItem}
          />
        </InputGroup>
        <InputGroup>
          <InputDescGroup>
            <InputTitle>{t('Description')}</InputTitle>
            <InputDesc>{t('Description of what the item is')}</InputDesc>
          </InputDescGroup>
          <AdminInput
            placeholder={t('Description')}
            value={itemData?.desc}
            name="desc"
            onChange={onChangeItem}
          />
        </InputGroup>
        <InputGroup>
          <InputDescGroup>
            <InputTitle>{t('Image')}</InputTitle>
            <InputDesc>{t('Product image')}</InputDesc>
          </InputDescGroup>
          <AdminInput
            placeholder={t('Image')}
            name="imagelink"
            onChange={handleChangeFile}
            type="file"
          />
        </InputGroup>
        <InputGroup>
          <InputDescGroup>
            <InputTitle>{t('Price')}</InputTitle>
            <InputDesc>{t('Price of goods (in dollar)')}</InputDesc>
          </InputDescGroup>
          <AdminInput
            placeholder={t('Price')}
            value={itemData?.price}
            name="price"
            onChange={onChangeItem}
          />
        </InputGroup>
        <InputGroup>
          <InputDescGroup>
            <InputTitle>{t('Category')}</InputTitle>
            <InputDesc>{t('Item category')}</InputDesc>
          </InputDescGroup>
          <StyledSelect
            options={categoryOptions}
            value={categoryOptions.find(option => option.value === itemData?.categoryid)}
            onChange={onChangeItemCategory}
          />
        </InputGroup>
        {
          type === 'update' ?
            <Button onClick={handleOpenSubItem}>{t('Edit Sub-item')}</Button> : <></>
        }
      </Modal>

      <AdminSubItemModal
        isShowing={isShowingSub}
        onCancel={handleCancelSubItem}
        subitems={itemData?.subitems!}
        createSubitem={createSubitem!}
        updateSubitem={updateSubitem!}
        deleteSubitem={deleteSubitem!}
        itemid={itemData?._id!}
      />
    </>
  )
}
