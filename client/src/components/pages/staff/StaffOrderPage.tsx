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
  flex-direction: column;
  flex-wrap: wrap; 
  align-content: flex-start;
  width: calc(100% - 60px);
  height: calc(100vh - 150px);
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

const OrderBox = styled.div<{ number: string }>`
  position: relative;
  width: auto;
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

  & span {
    margin-bottom: 10px;
    font-size: 24px;
    font-weight: bold;
  }

  & div {
    color: ${color.green};
    font-size: 60px;
    line-height: 0.1;

    &:hover {
      color: ${color.lightGreen};
    }
  }
`

const HeaderContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 0 30px;
  width: 100%;
  height: 100px;

  & span {
    cursor: pointer;
  }

  & .mode-container {
    display: flex;
    align-items: flex-end;
    justify-content: center;
    font-size: 48px;
    line-height: 1;
    width: 30%;
    font-weight: bold;
    color: #777;
    border-right: 5px solid ${color.black};

    & > span:first-child {
      margin-right: 25px;
    }

    & .active-mode {
      font-size: 72px;
      color: ${color.black};
      cursor: unset;
    }
  }

  & .process-container {
    display: flex;
    width: 70%;
    align-items: center;
    justify-content: space-around;
    font-size: 24px;
    font-weight: bold;
    color: #777;

    & .process-arrow {
      line-height: 0.2;
      cursor: unset;
    }

    & .active-process {
      font-size: 36px;
      color: ${color.black};
      cursor: unset;
    }
  }
`

type iStaffOrderPage = {
}

const StaffOrderPage: React.FC<iStaffOrderPage> = ({
}) => {
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

  const deleteOrder = React.useCallback(
    async cartid => {
      try {
        const res = await axios.delete(`/api/staff/order/${cartid}`)
        setOrderCarts(res.data)
      } catch (e) {
        notifyAxiosError(e)
      }
    },
    []
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
        notifySuccess(`状態更新を成功しました。新状態：${status.charAt(0).toUpperCase() + status.slice(1)}`)
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

        notifySuccess(`状態更新を成功しました。新状態：${status.charAt(0).toUpperCase() + status.slice(1)}`)
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
          <>{t('Order Number')}<b>{alertNumber}</b> {t('Do you want to complete it?')}</>
        </AlertModal>
        <HeaderContainer>
          <div className="mode-container">
            <span className="active-mode">{t('Order')}</span>
            <span onClick={() => history.push('/staff/table')}>{t('Table')}</span>
          </div>

          <div className="process-container">
            <span
              onClick={() => handleChangeProcess('processing')}
              className={currentStatus === 'processing' ? 'active-process' : ''}
            >
              {t('Processing')}
            </span>
            <span className="process-arrow"><FaAngleDoubleRight /></span>
            <span
              onClick={() => handleChangeProcess('waiting')}
              className={currentStatus === 'waiting' ? 'active-process' : ''}
            >
              {t('Waiting')}
            </span>
            <span className="process-arrow"><FaAngleDoubleRight /></span>
            <span
              onClick={() => handleChangeProcess('completed')}
              className={currentStatus === 'completed' ? 'active-process' : ''}
            >
              {t('Completed')}
            </span>
          </div>
        </HeaderContainer>
        <InnerContainer>
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
                        <span>{!!totalPrice && totalPrice(orderCart?.cart).toLocaleString()}{t('USD')}</span>
                        <div onClick={() => handleChangeOrderStatus(orderCart)}><IoMdCheckmarkCircle /></div>
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
