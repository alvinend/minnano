import React from 'react'
import styled from 'styled-components'
import { color } from '../atoms/color'
import { Layout, Table } from '../../models/common'
import { GiTable } from 'react-icons/gi'
import { LoadingMini } from 'components/atoms/LoadingMini'
import axios from 'axios'
import moment from 'moment'
import { useTranslation } from 'react-i18next'


const Overlay = styled.div<{ type: string }>`
  display: flex;
  align-items: center;
  position: fixed;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.9);
  z-index: 10;
  color: #eee;
  animation: ${({ type }) => type === 'in' ?
    'scale-in-ver-top 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both' :
    type === 'out' && 'scale-out-ver-top 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both'
  };

  @keyframes scale-in-ver-top {
    0% {
      transform: scaleY(0);
      transform-origin: 100% 0%;
      opacity: 1;
    }
    100% {
      transform: scaleY(1);
      transform-origin: 100% 0%;
      opacity: 1;
    }
  }

  @keyframes scale-out-ver-top {
    0% {
      transform: scaleY(1);
      transform-origin: 100% 0%;
      opacity: 1;
    }

    100% {
      transform: scaleY(0);
      transform-origin: 100% 0%;
      opacity: 1;
    }
  }

`

const StyledButton = styled.button`
  width: 40%;
  border: 2px #eee solid;
  background: inherit;
  color: #eee;
  font-size: 36px;
  margin-top: 20px;
  padding: 8px 0;
  font-size: 24px;
  font-weight: bold;

  &:hover {
      color: #333;
      background-color: ${color.lightGray};
    }

  &:active {
    background-color: white;
    transform: translateY(4px);
  }

  &:disabled {
    background-color: ${color.white};
    color: ${color.gray};

    &:hover {
      color: ${color.gray};
    }
  }
`

const OverlayInnerContainer = styled.div`
  display: flex;
  width: calc(100% - 150px);
  height: 90vh;
`

const OverviewContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 50%;
  height: 100%;

  & .main-icon {
    font-size: 300px;
    line-height: 0.4;
  }

  & .table-number {
    color: ${color.white};
    font-size: 108px;
    font-weight: bold;
    line-height: 1;
  }

  & .button-container {
    display: flex;
    justify-content: space-around;
    width: 100%;
  }

  & .total-price {
    font-weight: bold;
    font-size: 36px;
    line-height: 1;
  }
`

const DetailsContainer = styled.div`
  width: 50%;
  height: 100%;
  border-left: 10px dotted ${color.white};
  height: 100%;
  overflow: auto;
`

const OrderWrapper = styled.div`
  margin: 20px;
  color: white;

  & .order-header {
    padding: 10px 0;
    font-size: 20px;
    font-weight: bold;
    color: white;
    border-top: 1px solid ${color.white};
    border-bottom: 1px solid ${color.white};
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

type iTableOverlay = {
  animationType: string
  table: Table
  layout: Layout
  onCancel: () => void
  onFinish: () => void
}

export const TableOverlay: React.FC<iTableOverlay> = ({
  animationType,
  table,
  onCancel,
  onFinish,
  layout
}) => {
  const [resObject, setResObject] = React.useState<ResponseObject | undefined>(undefined)
  const [isLoading, setIsLoading] = React.useState(false)
  const { t: rawT } = useTranslation('customer')

  const t = React.useCallback(
    (str: string) => rawT(`CatalogPage.${str}`),
    [rawT]
  )

  const l = React.useMemo(
    () => layout?.picking?.tableOverlay,
    [layout]
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

  React.useEffect(
    () => {
      const fetch = async () => {
        setIsLoading(true)
        const res = await axios.get(`/api/customer/table/${table._id}`)
        setResObject(res.data)
        setIsLoading(false)
      }
      fetch()
    },
    [table]
  )

  return (
    <Overlay type={animationType}>
      <OverlayInnerContainer>
        <OverviewContainer>
          <div className="main-icon"><GiTable /></div>
          <h1 className="table-number">{table.label}</h1>
          <p className="total-price">{t('Total Price')}: {totalPrice} {layout?.currency}</p>
          <div className="button-container">
            <StyledButton onClick={onCancel}>
              {l?.backButton}
            </StyledButton>
            <StyledButton
              onClick={onFinish}
              disabled={totalPrice === '0'}
            >
              {l?.finishButton}
            </StyledButton>
          </div>
        </OverviewContainer>
        <DetailsContainer>
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
                      <OrderList>
                        <span>
                          {item.name} ({item.price}{layout?.currency})
                          <span className="order-quantity">X {quantity}</span>
                        </span>
                        <span>{item.price * quantity}{layout?.currency}</span>
                      </OrderList>
                    ))}
                  </OrderWrapper>
                )
              )}</div>
          }
        </DetailsContainer>
      </OverlayInnerContainer>
    </Overlay>
  )
}
