import React from 'react'
import styled from 'styled-components'
import { color } from '../../atoms/color'
import { IoMdCheckmarkCircle } from 'react-icons/io'
import { AlertModal } from '../../organisms/AlertModal'
import { Cart, OrderCart, OrderStatuses } from '../../../models/common'
import { FaAngleDoubleRight } from 'react-icons/fa'
import axios from 'axios'
import { notifyAxiosError, notifySuccess } from 'models/notification'
import { StaffLoading } from 'components/atoms/StaffLoading'
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router-dom'
import { OrderDetailModal } from 'components/organisms/staff/OrderDetailModal'
import { Button } from 'components/atoms/button'

const StaffOrderPageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100vh;
  background-color: ${color.lightGray};
`

const InnerContainer = styled.div`
  display: flex;
  flex-wrap: wrap; 
  justify-content: center;
  align-content: flex-start;
  width: calc(100% - 60px);
  height: calc(100vh - 150px);
  padding: 30px 30px 0 30px;
  background-color: ${color.secondary};
	animation: slide-in-top 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
  overflow: auto;
  border-radius: 45px;

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

const OrderBox = styled.div<{ number: string }>`
  position: relative;
  width: auto;
  height: auto;
  max-height: calc(100vh - 154px);
  background-color: ${color.white};
  margin-right: 40px;
  margin-bottom: 60px;
  border-radius: 25px;
  padding-top: 25px;
  box-shadow: 2px 2px 4px 2px rgba(0,0,0,0.2);
  cursor: pointer;

  &::after {
    content: '${props => props.number}';
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    border-radius: 15px;
    background-color: ${color.black};
    color: ${color.white};
    font-weight: bolder;
    width: 120px;
    height: 50px;
    font-size: 20px;
    top: -20px;
    left: calc(50% - 60px);
  }
`

const OrderBoxInner = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 0 20px;
`

const ListOrderContainer = styled.div`
  max-height: calc(100vh - 308px);
  height: auto;
  padding: 20px 0;
  overflow: auto;
  font-weight: bold;
  min-width: 190px;

  & span {
    text-align: right;
  }
`

const ListOrder = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  font-size: 18px;
  min-width: 160px;

  & span:first-child {
    margin-right: 20px;
  }
`

const OrderBoxActionContainer = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  text-align: center;
  padding: 10px 0;
  cursor: pointer;
  border-top: 2px ${color.black} solid;
`

const HeaderContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 0 30px;
  width: 100%;
  height: 100px;
  margin-bottom: 10px;
`

const StaffModeContainer = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  align-items: stretch;

  & > * {
    flex: 1;

    &:first-child {
      margin-right: 60px;
    }
  }
`

const StaffProcessContainer = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  margin-bottom: 50px;

  & > * {
    width: 300px;

    &:not(:last-child) {
      margin-right: 60px;
    }
  }
`

const StaffConfirmOrderButton = styled.div`
  color: ${color.blue};
  font-size: 60px;
  line-height: 0.1;
  transition: all 0.2s;

  &:hover {
    color: ${color.lightGreen};
  }
`
const TotalPriceSpan = styled.div`
  margin-bottom: 5px;
  font-size: 18px;
  font-weight: bold;
`

type iStaffOrderPage = {
}

const StaffOrderPage: React.FC<iStaffOrderPage> = () => {
  const [alertNumber, setAlertNumber] = React.useState('')
  const [alertId, setAlertId] = React.useState('')
  const [orderCarts, setOrderCarts] = React.useState<OrderCart[]>([])
  const [currentStatus, setCurrentStatus] = React.useState('processing')
  const [isLoading, setIsLoading] = React.useState(false)
  const [selectedOrderCart, setSelectedOrderCart] = React.useState({} as OrderCart)
  const history = useHistory()

  const { t } = useTranslation('staff')

  const totalPrice = React.useCallback(
    (cart: Cart) => cart.length && cart
      .map(cartItem => cartItem?.item?.price && cartItem?.item?.price * cartItem?.quantity)
      .reduce((a, b) => a + b),
    []
  )

  const triggerFetch = React.useCallback(
    async () => {
      try {
        const res = await axios.get(`/api/staff/order?status=${currentStatus}`)
        setOrderCarts(res.data)
      } catch (e) {
        notifyAxiosError(e)
      }

    },
    [currentStatus]
  )

  const deleteOrder = React.useCallback(
    async cartid => {
      try {
        setAlertId('')
        setAlertNumber('')
        setSelectedOrderCart({} as OrderCart)
        await axios.delete(`/api/staff/order/${cartid}`)
        await triggerFetch()
        notifySuccess('Order Deleted Successfully')
      } catch (e) {
        notifyAxiosError(e)
      }
    },
    [triggerFetch]
  )

  const handleOnSubmit = React.useCallback(
    async () => {
      await deleteOrder(alertId)
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
        5000
      )

      return () => { clearInterval(fetchInterval) }
    },
    [triggerFetch]
  )

  const handleChangeProcess = React.useCallback(
    async (status: string) => {
      setIsLoading(true)
      try {
        const res = await axios.get(`/api/staff/order?status=${status}`)
        setOrderCarts(res.data)
        setCurrentStatus(status)
      } catch (e) {
        notifyAxiosError(e)
      }
      setIsLoading(false)
    },
    []
  )

  const handleChangeOrderStatus = React.useCallback(
    async (orderCart: OrderCart) => {
      const status = OrderStatuses[OrderStatuses.findIndex(ele => ele === orderCart.status) + 1]

      try {
        if (status) {
          await axios.put(
            `/api/staff/order/${orderCart._id}`,
            { status }
          )
        } else {
          await axios.put(
            `/api/staff/order/${orderCart._id}`,
            { status: 'completed' }
          )
        }

        const res = await axios.get(`/api/staff/order?status=${orderCart.status}`)
        setOrderCarts(res.data)
        notifySuccess(`Order Status Updated。Order Status："${status.charAt(0).toUpperCase() + status.slice(1)}"`)
      } catch (e) {
        notifyAxiosError(e)
      }


    },
    []
  )

  const changeOrderStatus = React.useCallback(
    async (status: string) => {
      try {
        const res = await axios.put(
          `/api/staff/order/${selectedOrderCart._id}`,
          { status }
        )

        console.log(res.data)
        setSelectedOrderCart({
          ...selectedOrderCart,
          status: res.data.status
        })

        setOrderCarts((await axios.get(`/api/staff/order?status=${currentStatus}`)).data)

        notifySuccess(`Order Status Updated。Order Status："${status.charAt(0).toUpperCase() + status.slice(1)}"`)
      } catch (e) {
        notifyAxiosError(e)
      }

    },
    [selectedOrderCart, currentStatus]
  )

  return (
    <>
      <StaffOrderPageWrapper>
        <AlertModal
          isShowing={!!alertNumber}
          onSubmit={handleOnSubmit}
          onCancel={handleAlertCancel}
        >
          <>{t('Order Number')} <b>{alertNumber}</b> {t('Do you want to complete it?')}</>
        </AlertModal>
        <HeaderContainer>
          <StaffModeContainer>
            <Button color={color.white} backgroundColor={color.blue}>{t('Order')}</Button>
            <Button onClick={() => history.push('/staff/table')}>{t('Table')}</Button>
          </StaffModeContainer>
        </HeaderContainer>


        <InnerContainer>
          <StaffProcessContainer>
            <Button
              size="small"
              onClick={() => handleChangeProcess('processing')}
              backgroundColor={currentStatus === 'processing' ? color.yellow : ''}
              color={currentStatus === 'processing' ? color.white : ''}
            >
              {t('Processing')}
            </Button>
            <Button
              size="small"
              onClick={() => handleChangeProcess('waiting')}
              backgroundColor={currentStatus === 'waiting' ? color.yellow : ''}
              color={currentStatus === 'waiting' ? color.white : ''}
            >
              {t('Waiting')}
            </Button>
            <Button
              size="small"
              onClick={() => handleChangeProcess('completed')}
              backgroundColor={currentStatus === 'completed' ? color.yellow : ''}
              color={currentStatus === 'completed' ? color.white : ''}
            >
              {t('Completed')}
            </Button>
          </StaffProcessContainer>

          {isLoading ?
            <StaffLoading /> :
            <>
              {orderCarts.map(
                (orderCart: OrderCart) => (
                  <OrderBox key={orderCart._id} number={orderCart.label}>
                    <OrderBoxInner>
                      <ListOrderContainer onClick={() => setSelectedOrderCart(orderCart)}>
                        {orderCart?.cart?.map(
                          cartItem => (
                            <ListOrder key={cartItem?.item?._id}>
                              <span>{cartItem?.item?.name}</span>
                              <span>{cartItem?.quantity}x</span>
                            </ListOrder>
                          )
                        )}
                      </ListOrderContainer>
                      <OrderBoxActionContainer>
                        <TotalPriceSpan>Total {!!totalPrice && totalPrice(orderCart?.cart).toLocaleString()} {t('USD')}</TotalPriceSpan>
                        <StaffConfirmOrderButton onClick={() => handleChangeOrderStatus(orderCart)}><IoMdCheckmarkCircle /></StaffConfirmOrderButton>
                      </OrderBoxActionContainer>
                    </OrderBoxInner>
                  </OrderBox>
                )
              )}
            </>
          }
        </InnerContainer>
      </StaffOrderPageWrapper>
      <OrderDetailModal
        isShowing={!!selectedOrderCart._id}
        orderCart={selectedOrderCart}
        onCancel={() => setSelectedOrderCart({} as OrderCart)}
        changeOrderStatus={changeOrderStatus}
        deleteOrder={() => {
          setAlertId(selectedOrderCart._id)
          setAlertNumber(selectedOrderCart.label)
        }}
      />
    </>
  )
}

export { StaffOrderPage }
