import React from 'react'
import styled from 'styled-components'
import { color } from 'components/atoms/color'
import { Table, TableStatuses } from 'models/common'
import { FrostedBox } from 'components/atoms/FrostedBox'
import { RoundedButton } from 'components/atoms/button/RoundedButton'
import { RoundedButtonPrimary } from 'components/atoms/button/RoundedButtonPrimary'
import { useTranslation } from 'react-i18next'
import { capitalize } from 'utils'
import moment from 'moment'
import axios from 'axios'
import { LoadingMini } from 'components/atoms/LoadingMini'
import { Button } from 'components/atoms/button'

const TableDetailModalWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  width: 100vw;
  height: 100vh;
  z-index: 2;
  align-items: center;
  justify-content: center;
`

const Overlay = styled.div<{ type: string }>`
  position: fixed;
  display: flex;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.7);
  animation: ${({ type }) => type === 'in' ?
    'scale-in-ver-center 0.2s cubic-bezier(0.250, 0.460, 0.450, 0.940) both' :
    type === 'out' && 'scale-out-ver-center 0.2s cubic-bezier(0.250, 0.460, 0.450, 0.940) both'
  };

  @keyframes scale-in-ver-center {
    0% {
      transform: scaleY(0);
      opacity: 1;
    }

    100% {
      transform: scaleY(1);
      opacity: 1;
    }
  }

  @keyframes scale-out-ver-center {
    0% {
      transform: scaleY(1);
      opacity: 1;
    }

    100% {
      transform: scaleY(0);
      opacity: 1;
    }
  }
`

const StyledTableDetailModal = styled.div<{ type: string }>`
  display: flex;
  width: 80vw;
  height: 80vh;
  background-color: ${color.white};
  font-size: 16px;
  z-index: 3;
  border-radius: 25px;
  animation: ${({ type }) => type === 'in' ?
    'slide-in-bck-center 0.2s cubic-bezier(0.250, 0.460, 0.450, 0.940) both' :
    type === 'out' && 'slide-out-bck-center 0.2s cubic-bezier(0.250, 0.460, 0.450, 0.940) both'
  };

  @keyframes slide-in-bck-center {
    0% {
      transform: translateZ(600px);
      opacity: 0;
    }

    100% {
      transform: translateZ(0);
      opacity: 1;
    }
  }

  @keyframes slide-out-bck-center {
    0% {
      transform: translateZ(0);
      opacity: 1;
    }
  
    100% {
      transform: translateZ(600px);
      opacity: 0;
    }
  }
`

const DetailContainer = styled.div`
  width: 30%;
  padding: 45px 25px;
  background-color: ${color.secondary};
  border-radius: 25px;
`

const DetailBody = styled.div`
  height: calc(100% - 250px);
`

const DetailBodyItem = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 18px;

  & .title-desc {
    margin-bottom: 0;
    font-weight: 700;
  }

  & .title {
    margin-bottom: 15px;
  }
`

const DetailFooterItem = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  font-size: 24px;

  & .title-desc {
    margin-bottom: 5px;
    font-weight: 700;
  }

  & .title {
    margin-bottom: 15px;
  }

`

const DetailFooterButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 20px 0;
  line-height: 1.2;
  font-size: 16px;

  & > button:nth-child(2) {
    margin-left: 30px;
  }

  & > button {
    min-width: calc(50% - 15px);
    width: 100%;
  }
`

const OrdersContainer = styled.div`
  width: 70%;
  padding: 40px;
  height: 100%;
`

const OrdersInnerContainer = styled.div`
  height: 100%;
  overflow-y: scroll;
`

const OrderListContainer = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  background: ${color.secondary};
  height: calc(100% - 110px);
  padding: 10px 0;
  border-radius: 0 0 10px 10px;
`

const OrderListHeader = styled.div`
  width: 100%;
  background-color: ${color.secondary};
  padding: 8px 20px;
  font-weight: 700;
  border-radius: 10px 10px 0 0;

  & > .header-name {
    display: inline-block;
    width: 50%;
    border-right: 1px solid ${color.black};
  }
  
  & > .header-qty {
    display: inline-block;
    width: 100px;
    text-align: center;
    border-right: 1px solid ${color.black};
  }

  & > .header-price {
    display: inline-block;
    text-align: end;
    width: calc(50% - 100px);
    padding: 0 20px;
  }
`

const OrderWrapper = styled.div`
  & .order-header {
    margin-top: 15px;
    font-size: 20px;
    text-align: center;
    font-weight: 700;
  }
`

const OrderList = styled.div`
  display: flex;
  margin: 0 20px;
  font-size: 16px;
  padding: 10px 10px 10px 0;

  &:not(:last-child) {
    border-bottom: 1px solid ${color.black};
  }

  & > .order-name {
    display: inline-block;
    width: 50%;
  }

  & > .order-qty {
    width: 100px;
    text-align: center;

  }

  & > .order-price {
    width: calc(50% - 100px);
    text-align: end;
  }
`

type ResponseObject = {
  _id: string
  status: string
  label: string
  orders: {
    created_at: Date
    cart: {
      quantity: number
      item: {
        _id: string
        name: string
        price: number
      }
    }[]
  }[]
}

type iTableDetailModal = {
  isShowing: boolean
  changeTableStatus: (status: string) => void
  onCancel: () => void
  table: Table
}

export const TableDetailModal: React.FC<iTableDetailModal> = ({
  isShowing,
  changeTableStatus,
  onCancel,
  table
}) => {
  const [animationType, setAnimationType] = React.useState('in')
  const [resObject, setResObject] = React.useState({ } as ResponseObject)
  const [isLoading, setIsLoading] = React.useState(true)
  const { t: rawT } = useTranslation('staff')

  const t = React.useCallback(
    (str: string) => rawT(`TableDetailModal.${str}`),
    [rawT]
  )

  const apiT = React.useCallback(
    (str: string) => rawT(`API.${str}`),
    [rawT]
  )

  React.useEffect(
    () => {
      const fetchTable = async () => {
        setIsLoading(true)
        const res = await axios.get(`/api/staff/table/${table._id}`)

        setResObject(res.data)
        setIsLoading(false)
      }

      fetchTable()

      return () => { setResObject({ } as ResponseObject) }
    },
    [table]
  )

  const prevStatus = React.useMemo(
    () => {
      const index = TableStatuses.findIndex(ele => ele === table.status) - 1
      if (index > -1) {
        return capitalize(TableStatuses[index])
      }

      return null
    },
    [table]
  )

  const nextStatus = React.useMemo(
    () => {
      const index = TableStatuses.findIndex(ele => ele === table.status) + 1
      if (index < TableStatuses.length) {
        return capitalize(TableStatuses[index])
      }

      return null
    },
    [table]
  )

  const handleChangePrevStatus = React.useCallback(
    () => {
      changeTableStatus(prevStatus!)
    },
    [prevStatus, changeTableStatus]
  )

  const handleChangeNextStatus = React.useCallback(
    () => {
      changeTableStatus(nextStatus!)
    },
    [nextStatus, changeTableStatus]
  )

  const handleChangeFinishedStatus = React.useCallback(
    () => {
      changeTableStatus('finished')
    },
    [changeTableStatus]
  )


  const handleCloseTableDetailModal = React.useCallback(
    () => {
      setAnimationType('out')
      setTimeout(() => {
        setAnimationType('in')
        onCancel()
      }, 1000)
    },
    [onCancel]
  )

  const totalPrice = React.useMemo(
    () => {
      let totalPrice = 0
      const orders = resObject?.orders
      if (orders) {
        orders!.forEach(element => {
          element.cart.forEach(
            ({ quantity, item }) => {
              totalPrice += quantity * item.price
            }
          )
        })
      }

      return totalPrice.toLocaleString()
    },
    [resObject]
  )

  return isShowing ? (
    <TableDetailModalWrapper>
      <Overlay onClick={handleCloseTableDetailModal} type={animationType} />
      <StyledTableDetailModal type={animationType}>
        <DetailContainer>
          <DetailBody>
            <DetailBodyItem>
              <p className="title-desc">{t('Table no')}</p>
              <h2 className="title">{table.label}</h2>
            </DetailBodyItem>
            
            <DetailBodyItem>
              <p className="title-desc">{t('Status')}</p>
              <h2 className="title">{apiT(capitalize(table.status))}</h2>
            </DetailBodyItem>
          </DetailBody>

          <div>
            <DetailFooterItem>
              <p className="title-desc">{t('Total')}</p>
              <h2 className="title">{totalPrice} {apiT('USD')}</h2>
            </DetailFooterItem>

            <DetailFooterButtonContainer>
              {!!nextStatus &&
                <Button
                  onClick={handleChangeNextStatus}
                  size="large"
                  backgroundColor={color.blue}
                  color={color.white}
                >
                  Change To "{apiT(nextStatus)}"
                </Button>
              }
            </DetailFooterButtonContainer>
            <DetailFooterButtonContainer>
              <Button
                onClick={handleChangeFinishedStatus}
                size="large"
                backgroundColor={color.red}
                color={color.white}
              >
                {t('Reset Table')}
              </Button>
              {!!prevStatus &&
                <Button
                  onClick={handleChangePrevStatus}
                  size="large"
                >
                  Change Back "{apiT(prevStatus)}"
                </Button>
              }
            </DetailFooterButtonContainer>
          </div>

        </DetailContainer>
        <OrdersContainer>
            {
              isLoading ?
                <LoadingMini /> :
                <OrdersInnerContainer>
                  {resObject?.orders.map(
                    order => (
                      <OrderWrapper key={`order-${order.created_at}`}>
                        <h3 className="order-header">
                          Order {moment(order.created_at).format('HH:mm')}
                        </h3>
                        <OrderListHeader>
                          <span className="header-name">Name</span>
                          <span className="header-qty">Qty</span>
                          <span className="header-price">Price</span>
                        </OrderListHeader>

                        <OrderListContainer>
                          <div>
                            {order.cart.map(({ quantity, item }) => (
                              <OrderList key={item._id}>
                                <span className="order-name">{item.name}({item.price.toLocaleString()}{apiT('USD')})</span>
                                <span className="order-qty">{quantity}</span>
                                <span className="order-price">{(item.price * quantity).toLocaleString()}{apiT('USD')}</span>
                              </OrderList>
                            ))}
                          </div>
                        </OrderListContainer>
                      </OrderWrapper>
                    )
                  )}
                </OrdersInnerContainer>
              }
        </OrdersContainer>
      </StyledTableDetailModal>
    </TableDetailModalWrapper>
  ) : null
}
