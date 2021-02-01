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
  width: 40%;
  padding: 40px;
  background-color: ${color.primary};

  & > .detail-body {
    height: calc(100% - 300px);

    & .title-desc {
      margin-bottom: 0
    }

    & .title {
      font-size: 24px;
      margin-bottom: 15px;
    }
  }
`

const VariationContainer = styled.div`
  width: 60%;
  padding: 40px;
  margin-top: 30px;
  
  & > .subitem-inner {
    display: flex;
    flex-wrap: wrap;
    align-content: flex-start;
    justify-content: space-between;
    width: 100%;
    height: 80%;
    margin-top: 20px;
    overflow: auto;

    & ${FrostedBox} {
      width: 48%;
      margin-bottom: 20px;
      transition: .3s all ease-in-out;

      &:hover {
        background: linear-gradient(130deg, ${color.pink} 0%, ${color.secondary} 100%);
        box-shadow: none;
        transition: .3s all ease-in-out;
        cursor: pointer;

        & .subitem-price {
          border: 2px solid ${color.black};
        }
      }
    }
  }

  & .subitem-title {
    display: flex;
    align-items: center;
    font-weight: bold;

    & > .subitem-price {
      margin-left: 20px;
      padding: 2px 8px;
      border-radius: 20px;
      border: 2px solid ${color.secondary};
      font-size: 16px;
    }
  }

  & .subitem-desc {
    font-size: 16px;
  }

  & .order-footer {
    margin-top: 20px;
    padding: 10px 0;
    font-size: 20px;
    font-weight: bold;
    border-top: 1px solid ${color.black};
    border-bottom: 1px solid ${color.black};
  }
`

const OrderWrapper = styled.div`
  overflow-y: auto;

  & .order-header {
    padding: 10px 0;
    font-size: 20px;
    font-weight: bold;
    border-top: 1px solid ${color.black};
    border-bottom: 1px solid ${color.black};
  }
`

const OrderList = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 0 20px;
  font-size: 16px;

  & .order-quantity {
    margin-left: 20px;
  }
`

const CartInfoFooter = styled.div`
  border-top: 10px dotted ${color.black};
  padding: 20px;

  & .button-container {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    margin: 20px 0;
    font-size: 16px;

    & > button {
      width: 100%;
      margin-bottom: 20px;
    }

    & .main-button {
      font-size: 24px;
      font-weight: bold;
    }
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
        console.log(table)
        const res = await axios.get(`/api/staff/table/${table._id}`)

        console.log(res)
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
          <div className="detail-body">
            <p className="title-desc">{t('Table no')}</p>
            <h2 className="title">{table.label}</h2>

            <p className="title-desc">{t('Status')}</p>
            <h2 className="title">{apiT(capitalize(table.status))}</h2>
          </div>

          <CartInfoFooter>
            <div className="button-container">
              {!!prevStatus &&
                <RoundedButton
                  onClick={handleChangePrevStatus}
                >
                  {t('Change Status Back to')} "{apiT(prevStatus)}"
                </RoundedButton>
              }

              {!!nextStatus &&
                <RoundedButtonPrimary
                  onClick={handleChangeNextStatus}
                  className="main-button"
                >
                  {t('Change Status to')} "{apiT(nextStatus)}"
                </RoundedButtonPrimary>
              }

              <RoundedButton
                onClick={handleChangeFinishedStatus}
              >
                {t('Reset Table')}
              </RoundedButton>
            </div>
          </CartInfoFooter>

        </DetailContainer>
        <VariationContainer>
            {
              isLoading ?
                <LoadingMini /> :
                <div>{resObject?.orders.map(
                  order => (
                    <OrderWrapper key={`order-${order.created_at}`}>
                      <h3 className="order-header">
                        {t('Order')} {moment(order.created_at).format('HH:mm')}
                      </h3>
                      {order.cart.map(({ quantity, item }) => (
                        <OrderList key={item._id}>
                          <span>
                            {item.name} ({item.price.toLocaleString()}{apiT('USD')})
                            <span className="order-quantity">X {quantity}</span>
                          </span>
                          <span>{(item.price * quantity).toLocaleString()}{apiT('USD')}</span>
                        </OrderList>
                      ))}
                    </OrderWrapper>
                  )
                )}</div>
              }
              <h3 className="order-footer">
                {t('Total')}: {totalPrice} {apiT('USD')}
              </h3>
        </VariationContainer>
      </StyledTableDetailModal>
    </TableDetailModalWrapper>
  ) : null
}
