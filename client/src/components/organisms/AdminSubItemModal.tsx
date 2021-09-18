import * as React from 'react'
import styled from 'styled-components'
import { Modal } from 'components/organisms/Modal'
import { AdminInput } from 'components/atoms/input/AdminInput'
import { Subitem } from 'models/common'
import { Card } from 'antd'
import { FaAngleDown } from 'react-icons/fa'
import { color } from 'components/atoms/color'
import ButtonGroup from 'antd/lib/button/button-group'
import { useTranslation } from 'react-i18next'
import { Button, ButtonPrimary } from 'components/atoms/button'

const InputTitle = styled.h3`
  font-size: 16px;
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

const StyledListCardHeader = styled.div<{ isSelected: boolean }>`
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  opacity: ${({ isSelected }) => isSelected ? '1' : '0.5'};
  transition: opacity .25s ease-in-out;
  font-weight: bold;
  font-size: 18px;

  &:hover {
    opacity: 1;
  }
`

const StyledListCard = styled(Card)`
  display: flex;
  align-items: center;
  margin-bottom: 10px;

  & .ant-card-body {
    width: 100%;
  }

  & svg {
    position: absolute;
    right: 20px;
    font-size: 20px;
  }
`

const StyledListCardDetails = styled.div<{ isShowing: boolean }>`
  ${({ isShowing }) => !isShowing ? 'display: none;' : null}
  border-top: 1px solid ${color.gray};
  margin-top: 10px;
  padding: 15px 0;
	animation: scale-up-ver-top 0.4s cubic-bezier(0.390, 0.575, 0.565, 1.000) both;


  @keyframes scale-up-ver-top {
    0% {
      height: 0;
      transform: scaleY(0);
      transform-origin: 100% 0%;
    }
    100% {
      height: 350px;
      transform: scaleY(1);
      transform-origin: 100% 0%;
    }
  }

`

const StyledButtonGroup = styled(ButtonGroup)`
  width: 150px;
  justify-content: space-between;
  margin-top: 10px;
`

const ListCardContainer = styled.div`
  height: calc(70vh - 100px);
  overflow: auto;
`

type iAdminSubItemModal = {
  isShowing: boolean
  onCancel: () => void
  subitems: Subitem[]

  updateSubitem: (editingSubitem: Subitem) => Promise<Subitem[] | undefined>
  deleteSubitem: (deletingSubitem: Subitem) => Promise<Subitem[] | undefined>
  createSubitem: (creatingSubitem: Subitem) => Promise<Subitem[] | undefined>
  itemid: string
}

export const AdminSubItemModal: React.FC<iAdminSubItemModal> = ({
  isShowing,
  onCancel,
  subitems,
  updateSubitem,
  deleteSubitem,
  createSubitem,
  itemid
}) => {
  const [showingDetailSub, setShowingDetailSub] = React.useState('')
  const [creatingSubitemData, setCreatingSubitemData] = React.useState({} as Subitem)
  const [editingSubitemData, setEditingSubitemData] = React.useState({} as Subitem)
  const [subitemsState, setSubitemsState] = React.useState(subitems)
  const { t: rawT } = useTranslation('admin')

  const t = React.useCallback(
    (str: string) => rawT(`ItemPage.${str}`),
    [rawT]
  )


  React.useEffect(
    () => {
      setSubitemsState(subitems)
    },
    [subitems]
  )

  const handleExpandDetail = React.useCallback(
    (subitem: Subitem) => {
      if (showingDetailSub === subitem._id) {
        setShowingDetailSub('')
        setEditingSubitemData({} as Subitem)
      } else {
        setShowingDetailSub(subitem._id)
        setEditingSubitemData({ ...subitem })
      }
    },
    [showingDetailSub]
  )

  const handleExpandCreate = React.useCallback(
    () => {
      if (showingDetailSub === 'create') {
        setShowingDetailSub('')
        setCreatingSubitemData({} as Subitem)
      } else {
        setShowingDetailSub('create')
      }
    },
    [showingDetailSub]
  )

  const handleChangeEditingItem = React.useCallback(
    e => {
      const name = e.currentTarget.name
      const value = e.currentTarget.value

      // @ts-ignore
      editingSubitemData[name] = value
      // @ts-ignore
      setEditingSubitemData({ ...editingSubitemData })
    },
    [editingSubitemData]
  )

  const handleChangeCreatingItem = React.useCallback(
    e => {
      // @ts-ignore
      creatingSubitemData[e.currentTarget.name] = e.currentTarget.value
      // @ts-ignore
      setCreatingSubitemData({ ...creatingSubitemData })
    },
    [creatingSubitemData]
  )

  const handleCreate = React.useCallback(
    async () => {
      const subitems = await createSubitem({ ...creatingSubitemData, itemid })

      if (!!subitems?.length) {
        setSubitemsState([...subitems])
      }
    },
    [creatingSubitemData, createSubitem, itemid]
  )

  const handleDelete = React.useCallback(
    async () => {
      const subitems = await deleteSubitem(editingSubitemData)

      if (!!subitems?.length) {
        setSubitemsState([...subitems])
      }
    },
    [editingSubitemData, deleteSubitem]
  )

  const handleUpdate = React.useCallback(
    async () => {
      const subitems = await updateSubitem(editingSubitemData)

      if (!!subitems?.length) {
        setSubitemsState([...subitems])
      }
    },
    [editingSubitemData, updateSubitem]
  )

  return (
    <Modal
      isShowing={isShowing}
      onSubmit={onCancel}
      onCancel={onCancel}
    >
      <ModalTitle>{t('Edit Sub-item')}</ModalTitle>
      <ListCardContainer>
        {subitemsState?.map(subitem => <StyledListCard size="small" key={subitem._id}>
          <StyledListCardHeader
            onClick={() => handleExpandDetail(subitem)}
            isSelected={showingDetailSub === subitem._id}
          >
            {subitem.name}
            <FaAngleDown />
          </StyledListCardHeader>

          <StyledListCardDetails isShowing={showingDetailSub === subitem._id}>
            <InputGroup>
              <InputDescGroup>
                <InputTitle>{t('Sub-item Name')}</InputTitle>
                <InputDesc>{t('Name of Sub-item')}</InputDesc>
              </InputDescGroup>
              <AdminInput
                placeholder={t('Sub-item Name')}
                value={editingSubitemData?.name}
                name="name"
                onChange={handleChangeEditingItem}
              />
            </InputGroup>

            <InputGroup>
              <InputDescGroup>
                <InputTitle>{t('Description')}</InputTitle>
                <InputDesc>{t('Description of what the Sub-item is')}</InputDesc>
              </InputDescGroup>
              <AdminInput
                placeholder={t('Description')}
                value={editingSubitemData?.desc}
                name="desc"
                onChange={handleChangeEditingItem}
              />
            </InputGroup>

            <InputGroup>
              <InputDescGroup>
                <InputTitle>{t('Price')}</InputTitle>
                <InputDesc>{t('Sub-item price')}</InputDesc>
              </InputDescGroup>
              <AdminInput
                placeholder={t('Price')}
                value={editingSubitemData?.price}
                name="price"
                onChange={handleChangeEditingItem}
              />
            </InputGroup>

            <InputGroup>
              <InputDescGroup>
                <InputTitle>Stock</InputTitle>
                <InputDesc>{t('Sub-item stock (-1 for unlimited)')}</InputDesc>
              </InputDescGroup>
              <AdminInput
                placeholder="Stock"
                value={editingSubitemData?.stock}
                name="stock"
                onChange={handleChangeEditingItem}
              />
            </InputGroup>

            <StyledButtonGroup>
              <Button
                backgroundColor={color.red}
                size="small"
                color={color.white}
                onClick={handleDelete}
                margin="0 20px 0 0"
              >
                {t('Delete')}
              </Button>
              <ButtonPrimary
                onClick={handleUpdate}
                size="small"
              >
                {t('Update')}
              </ButtonPrimary>
            </StyledButtonGroup>
          </StyledListCardDetails>
        </StyledListCard>)}

        {/* Create New Item */}
        <StyledListCard size="small">
          <StyledListCardHeader
            onClick={handleExpandCreate}
            isSelected={showingDetailSub === 'create'}
          >
            {t('Add Sub-item')}
            <FaAngleDown />
          </StyledListCardHeader>

          <StyledListCardDetails isShowing={showingDetailSub === 'create'}>
            <InputGroup>
              <InputDescGroup>
                <InputTitle>{t('Sub-item Name')}</InputTitle>
                <InputDesc>{t('Name of Sub-item')}</InputDesc>
              </InputDescGroup>
              <AdminInput
                placeholder={t('Sub-item Name')}
                value={creatingSubitemData?.name}
                name="name"
                onChange={handleChangeCreatingItem}
              />
            </InputGroup>

            <InputGroup>
              <InputDescGroup>
                <InputTitle>{t('Description')}</InputTitle>
                <InputDesc>{t('Description of what the Sub-item is')}</InputDesc>
              </InputDescGroup>
              <AdminInput
                placeholder={t('Description')}
                value={creatingSubitemData?.desc}
                name="desc"
                onChange={handleChangeCreatingItem}
              />
            </InputGroup>

            <InputGroup>
              <InputDescGroup>
                <InputTitle>{t('Price')}</InputTitle>
                <InputDesc>{t('Sub-item price')}</InputDesc>
              </InputDescGroup>
              <AdminInput
                placeholder={t('Price')}
                value={creatingSubitemData?.price}
                name="price"
                onChange={handleChangeCreatingItem}
              />
            </InputGroup>

            <InputGroup>
              <InputDescGroup>
                <InputTitle>{t('Price')}</InputTitle>
                <InputDesc>{t('Sub-item price')}</InputDesc>
              </InputDescGroup>
              <AdminInput
                placeholder={t('Price')}
                value={creatingSubitemData?.price}
                name="price"
                onChange={handleChangeCreatingItem}
              />
            </InputGroup>

            <StyledButtonGroup>
              <ButtonPrimary
                onClick={handleCreate}
                size="small"
              >
                {t('Create')}
              </ButtonPrimary>
            </StyledButtonGroup>
          </StyledListCardDetails>
        </StyledListCard>

      </ListCardContainer>
    </Modal>
  )
}
