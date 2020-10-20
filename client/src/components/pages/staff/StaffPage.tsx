import React from 'react'
import styled from 'styled-components'
import { color } from '../../atoms/color'
import { IoMdCheckmarkCircle } from 'react-icons/io'
import { AlertModal } from '../../organisms/AlertModal'
import { Cart, OrderCarts } from '../../../models/common'

const StaffPageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100vh;
  background-color: ${color.lightGray};
`

const Title = styled.h1`
  font-size: 32px;
  color: ${color.black};
`

const InnerContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: wrap; 
  align-content: flex-start;
  width: 90%;
  height: calc(100vh - 84px);
  margin: 20px 0;
  padding: 30px 30px 0 30px;
  background-color: ${color.secondary};
  border: 2px ${color.gray} solid;
  border-radius: 5px;
	animation: slide-in-top 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
  overflow: auto;

  @keyframes slide-in-top {
    0% {
      transform: translateY(-1000px);
      opacity: 0;
    }
    100% {
      transform: translateY(0);
      opacity: 1;
    }
  }
`

const OrderBox = styled.div<{ number: number }>`
  position: relative;
  width: 400px;
  height: auto;
  max-height: calc(100vh - 154px);
  background-color: ${color.white};
  margin-right: 30px;
  margin-bottom: 30px;
  border: 2px ${color.gray} solid;

  &::after {
    content: '${props => props.number}';
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    top: -25px;
    left: -25px;
    border-radius: 50%;
    background-color: ${color.black};
    color: ${color.white};
    font-weight: bolder;
    width: 50px;
    height: 50px;
  }
`

const OrderBoxInner = styled.div`
  
`

const ListOrderContainer = styled.div`
  max-height: calc(100vh - 308px);
  height: auto;
  padding: 20px 15px;
  overflow: auto;
  border-bottom: 5px ${color.gray} dotted;
  font-weight: bold;

  & span {
    text-align: right;
  }
`

const ListOrder = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  font-size: 18px;
`

const OrderBoxActionContainer = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  text-align: center;
  height: 150px;
  padding: 20px 0;
  cursor: pointer;

  & span {
    margin-bottom: 10px;
    font-size: 24px;
    font-weight: bold;
  }

  & div {
    color: ${color.green};
    font-size: 60px;

    &:hover {
      color: ${color.lightGreen};
    }
  }
`

type iStaffPage = {
  orderCarts: OrderCarts
  deleteOrder: (alertId: string) => void
  triggerFetch: () => void
}

const StaffPage: React.FC<iStaffPage> = ({
  orderCarts,
  deleteOrder,
  triggerFetch
}) => {
  const [alertNumber, setAlertNumber] = React.useState('')
  const [alertId, setAlertId] = React.useState('')

  const totalPrice = React.useCallback(
    (cart: Cart) => cart.length && cart
      .map(cartItem => cartItem.item.price * cartItem.quantity)
      .reduce((a, b) => a + b),
    []
  )

  const handleDeleteOrder = React.useCallback(
    cart => () => {
      setAlertId(cart.id)
      setAlertNumber(cart.number)
      deleteOrder(alertId)
    },
    [deleteOrder, alertId]
  )

  const handleOnSubmit = React.useCallback(
    () => {
      deleteOrder(alertId)
      setAlertId('')
      setAlertNumber('')
    },
    [alertId, deleteOrder]
  )

  const handleAlertCancel = React.useCallback(
    () => {
      setAlertId('')
      setAlertNumber('')
    },
    []
  )

  React.useEffect(
    () => {
      const fetchInterval = setInterval(
        () => {
          triggerFetch()
        },
        1000
      )

      return () => { clearInterval(fetchInterval) }
    },
    [triggerFetch]
  )

  return (
    <StaffPageWrapper>
      <AlertModal
        isShowing={!!alertNumber}
        onSubmit={handleOnSubmit}
        onCancel={handleAlertCancel}
      >
        <>Apakah Orderan Nomor <b>{alertNumber}</b> Sudah Selesai?</>
      </AlertModal>
      <Title>Pesanan</Title>
      <InnerContainer>
        {orderCarts.map(
          orderCart => (
            <OrderBox key={orderCart.id} number={orderCart.number}>
              <OrderBoxInner>
                <ListOrderContainer>
                  {orderCart.cart.map(
                    cartItem => (
                      <ListOrder key={cartItem.item._id}>
                        <span>{cartItem.item.name}</span>
                        <span>{cartItem.quantity}x</span>
                      </ListOrder>
                    )
                  )}
                </ListOrderContainer>
                <OrderBoxActionContainer>
                  <span>Rp {totalPrice(orderCart.cart)}</span>
                  <div onClick={handleDeleteOrder(orderCart)}><IoMdCheckmarkCircle  /></div>
                </OrderBoxActionContainer>
              </OrderBoxInner>
            </OrderBox>
          )
        )}
      </InnerContainer>
    </StaffPageWrapper>
  )
}

export { StaffPage }
