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
import { Button } from 'components/atoms/button'

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
  font-size: 18px;

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

const OrderContainer = styled.div`
  width: 70%;
  padding: 40px;
  height: 100%;
`

const OrderWrapper = styled.div`
  overflow-y: auto;
  height: 100%;

  & .order-header {
    font-size: 20px;
    text-align: center;
    font-weight: 700;
  }
`

const OrderListHeader = styled.div`
  width: 100%;
  background-color: ${color.secondary};
  margin-bottom: 20px;
  border-radius: 10px;
  padding: 8px 20px;
  font-weight: 700;

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

const OrderListContainer = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  background: ${color.secondary};
  height: calc(100% - 110px);
  border-radius: 10px;
  padding-top: 10px;
`

const OrderList = styled.div`
  display: flex;
  margin: 0 20px;
  font-size: 16px;
  padding: 10px 10px 10px 0;
  border-bottom: 1px solid ${color.black};

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

const OrderFooter = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 50px;
  padding: 10px 20px;
  font-size: 20px;
  font-weight: bold;
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
  const { t: rawT } = useTranslation('staff')

  const t = React.useCallback(
    (str: string) => rawT(`OrderDetailModal.${str}`),
    [rawT]
  )

  const apiT = React.useCallback(
    (str: string) => rawT(`API.${str}`),
    [rawT]
  )

  const prevStatus = React.useMemo(
    () => {
      const index = OrderStatuses.findIndex(ele => ele === orderCart.status) - 1
      if (index > -1) {
        return capitalize(OrderStatuses[index])
      }

      return null
    },
    [orderCart]
  )

  const nextStatus = React.useMemo(
    () => {
      const index = OrderStatuses.findIndex(ele => ele === orderCart.status) + 1
      if (index < OrderStatuses.length - 1) {
        return capitalize(OrderStatuses[index])
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
          <DetailBody>
            <DetailBodyItem>
              <p className="title-desc">{t('Order no')}</p>
              <h2 className="title">{orderCart.label}</h2>
            </DetailBodyItem>
            
            <DetailBodyItem>
              <p className="title-desc">{t('Status')}</p>
              <h2 className="title">{apiT(capitalize(orderCart.status))}</h2>
            </DetailBodyItem>
          </DetailBody>

          <div>
            <DetailFooterItem>
              <p className="title-desc">{t('Created At')}</p>
              <h2 className="title">{moment(orderCart.createdAt).format('YYYY/MM/DD HH:mm:ss')}</h2>
            </DetailFooterItem>

            <DetailFooterButtonContainer>
              <Button
                onClick={handleChangeCompletedStatus}
                size="large"
              >
                {t('Complete Order')}
              </Button>

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
                onClick={handleDeleteOrder}
                size="large"
                backgroundColor={color.red}
                color={color.white}
              >
                {t('Delete Order')}
              </Button>
              {!!prevStatus &&
                <Button
                  onClick={handleChangePrevStatus}
                  size="large"
                >
                  {t('Change Status Back to')} "{apiT(prevStatus)}"
                </Button>
              }
            </DetailFooterButtonContainer>
          </div>

        </DetailContainer>
        <OrderContainer>
          <OrderWrapper>
            <h3 className="order-header">
              {t('Order Detail')}
            </h3>
            
            <OrderListHeader>
              <span className="header-name">Name</span>
              <span className="header-qty">Qty</span>
              <span className="header-price">Price</span>
            </OrderListHeader>

            <OrderListContainer>
              <div>
                {orderCart?.cart?.map(({ item, quantity }) => <OrderList key={item._id}>
                  <span className="order-name">{item.name} ({item.price.toLocaleString()} {apiT('USD')})</span>
                  <span className="order-qty">{quantity}x</span>
                  <span className="order-price">{(item.price * quantity).toLocaleString()} {apiT('USD')}</span>
                </OrderList>)}
              </div>

              <OrderFooter>
                <span>{t('Total')}</span>
                <span>{totalPrice} {apiT('USD')}</span>
              </OrderFooter>
            </OrderListContainer>
          </OrderWrapper>
        </OrderContainer>
      </StyledOrderDetailModal>
    </OrderDetailModalWrapper>
  ) : null
}
