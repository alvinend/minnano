import * as React from 'react'
import styled from 'styled-components'
import { Category } from 'models/common'
import { Modal } from 'components/organisms/Modal'
import { AdminInput } from 'components/atoms/input/AdminInput'
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

type iAdminCategoryModal = {
  isShowing: boolean
  onSubmit: () => void
  onCancel: () => void
  categoryData: Category | null
  onChangeCategory: (e: any) => void
  changeImage: (file: any) => void
  type: 'create' | 'edit'
}


export const AdminCategoryModal: React.FC<iAdminCategoryModal> = ({
  isShowing,
  onSubmit,
  onCancel,
  categoryData,
  onChangeCategory,
  changeImage,
  type
}) => {
  const { t: rawT } = useTranslation('admin')

  const t = React.useCallback(
    (str: string) => rawT(`CategoryPage.${str}`),
    [rawT]
  )

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
      <ModalTitle>{type === 'create' ? 'Create Category' : t('Edit Category Details')}</ModalTitle>
      <InputGroup>
        <InputDescGroup>
          <InputTitle>{t('Category Name')}</InputTitle>
          <InputDesc>{t('Name of category, Will mainly be display')}</InputDesc>
        </InputDescGroup>
        <AdminInput
          placeholder={t('Category Name')}
          value={categoryData?.name}
          name="name"
          onChange={onChangeCategory}
        />
      </InputGroup>
      <InputGroup>
        <InputDescGroup>
          <InputTitle>{t('Description')}</InputTitle>
          <InputDesc>{t('Description of what the category is')}</InputDesc>
        </InputDescGroup>
        <AdminInput
          placeholder={t('Description')}
          value={categoryData?.desc}
          name="desc"
          onChange={onChangeCategory}
        />
      </InputGroup>
      <InputGroup>
        <InputDescGroup>
          <InputTitle>{t('Image')}</InputTitle>
          <InputDesc>{t('Category image')}</InputDesc>
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
