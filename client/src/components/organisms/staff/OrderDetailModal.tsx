import React from 'react'
import styled from 'styled-components'
import { color } from 'components/atoms/color'
import { OrderCart, OrderStatuses } from 'models/common'
import { FrostedBox } from 'components/atoms/FrostedBox'
import { RoundedButton } from 'components/atoms/button/RoundedButton'
import { RoundedButtonPrimary } from 'components/atoms/button/RoundedButtonPrimary'
import { RoundedButtonDanger } from 'components/atoms/button/RoundedButtonDanger'
import { useTranslation } from 'react-i18next'
import { capitalize } from 'utils'
import moment from 'moment'

const OrderDetailModalWrapper = styled.div`
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

const StyledOrderDetailModal = styled.div<{ type: string }>`
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

  & .order-footer {
    margin-top: 20px;
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

type iOrderDetailModal = {
  isShowing: boolean
  deleteOrder: () => void
  changeOrderStatus: (status: string) => void
  onCancel: () => void
  orderCart: OrderCart
}

export const OrderDetailModal: React.FC<iOrderDetailModal> = ({
  isShowing,
  orderCart,
  deleteOrder,
  changeOrderStatus,
  onCancel,
}) => {
  const [animationType, setAnimationType] = React.useState('in')
  const { t: rawT } = useTranslation('customer')

  // eslint-disable-next-line
  const t = React.useCallback(
    (str: string) => rawT(`OrderDetailModal.${str}`),
    [rawT]
  )

  const prevStatus = React.useMemo(
    () => {
      const index = OrderStatuses.findIndex(ele => ele === orderCart.status) - 1
      if (index > -1) {
        return OrderStatuses[index]
      }

      return null
    },
    [orderCart]
  )

  const nextStatus = React.useMemo(
    () => {
      const index = OrderStatuses.findIndex(ele => ele === orderCart.status) + 1
      if (index < OrderStatuses.length - 1) {
        return OrderStatuses[index]
      }

      return null
    },
    [orderCart]
  )

  const handleDeleteOrder = React.useCallback(
    async () => {
      await deleteOrder()
    },
    [deleteOrder]
  )

  const handleChangePrevStatus = React.useCallback(
    () => {
      changeOrderStatus(prevStatus!)
    },
    [prevStatus, changeOrderStatus]
  )

  const handleChangeNextStatus = React.useCallback(
    () => {
      changeOrderStatus(nextStatus!)
    },
    [nextStatus, changeOrderStatus]
  )

  const handleChangeCompletedStatus = React.useCallback(
    () => {
      changeOrderStatus('completed')
    },
    [changeOrderStatus]
  )


  const handleCloseOrderDetailModal = React.useCallback(
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
    () => orderCart?.cart && orderCart?.cart
      .map(cartItem => cartItem.item.price * cartItem.quantity)
      .reduce((a, b) => a + b)
      .toLocaleString(),
    [orderCart]
  )

  return isShowing ? (
    <OrderDetailModalWrapper>
      <Overlay onClick={handleCloseOrderDetailModal} type={animationType} />
      <StyledOrderDetailModal type={animationType}>
        <DetailContainer>
          <div className="detail-body">
            <p className="title-desc">Order no.</p>
            <h2 className="title">{orderCart.label}</h2>

            <p className="title-desc">Status</p>
            <h2 className="title">{capitalize(orderCart.status)}</h2>

            <p className="title-desc">Created At</p>
            <h2 className="title">{moment(orderCart.createdAt).format('YYYY/MM/DD HH:mm:ss')}</h2>
          </div>

          <CartInfoFooter>
            <div className="button-container">
              <RoundedButtonDanger
                onClick={handleDeleteOrder}
              >
                Delete Order
              </RoundedButtonDanger>

              {!!prevStatus &&
                <RoundedButton
                  onClick={handleChangePrevStatus}
                >
                  Change Status Back to "{prevStatus}"
                </RoundedButton>
              }

              {!!nextStatus &&
                <RoundedButtonPrimary
                  onClick={handleChangeNextStatus}
                  className="main-button"
                >
                  Change Status to "{nextStatus}"
                </RoundedButtonPrimary>
              }

              <RoundedButton
                onClick={handleChangeCompletedStatus}
              >
                Complete Order
              </RoundedButton>
            </div>
          </CartInfoFooter>

        </DetailContainer>
        <VariationContainer>
          <OrderWrapper>
            <h3 className="order-header">
              Order Detail
            </h3>
            {orderCart?.cart?.map(({ item, quantity }) => <OrderList key={item._id}>
              <span>
                {item.name} ({item.price.toLocaleString()} USD)
                <span className="order-quantity">X {quantity}</span>
              </span>
              <span>{(item.price * quantity).toLocaleString()} USD</span>
            </OrderList>)}
            <h3 className="order-footer">
              Total: {totalPrice} USD
            </h3>
          </OrderWrapper>
        </VariationContainer>
      </StyledOrderDetailModal>
    </OrderDetailModalWrapper>
  ) : null
}
