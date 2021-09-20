import React from 'react'
import styled from 'styled-components'
import { color } from '../../atoms/color'
import { IoMdCheckmarkCircle } from 'react-icons/io'
import { AlertModal } from '../../organisms/AlertModal'
import { Table } from '../../../models/common'
import { FaAngleDoubleRight } from 'react-icons/fa'
import axios from 'axios'
import { notifyAxiosError, notifySuccess } from 'models/notification'
import { useTranslation } from 'react-i18next'
import { StaffLoading } from 'components/atoms/StaffLoading'
import { useHistory } from 'react-router-dom'
import { TableDetailModal } from 'components/organisms/staff/TableDetailModal'
import { Button } from 'components/atoms/button'

const StaffTablePageWrapper = styled.div`
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

type iStaffTablePage = {
}

const StaffTablePage: React.FC<iStaffTablePage> = () => {
  const [alertNumber, setAlertNumber] = React.useState('')
  // eslint-disable-next-line
  const [alertId, setAlertId] = React.useState('')
  const [tables, setTables] = React.useState<Table[]>([])
  const [currentStatus, setCurrentStatus] = React.useState('idle')
  const [isLoading, setIsLoading] = React.useState(false)
  const { t } = useTranslation('staff')
  const history = useHistory()
  const [selectedTable, setSelectedTable] = React.useState({ } as Table)

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
        const res = await axios.get(`/api/staff/table?status=${currentStatus}`)
        setTables(res.data)
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
        const res = await axios.get(`/api/staff/table?status=${status}`)
        setTables(res.data)
        setCurrentStatus(status)
      } catch (e) {
        notifyAxiosError(e)
      }
      setIsLoading(false)
    },
    []
  )

  const handleChangeOrderStatus = React.useCallback(
    async (table: Table) => {
      const statuses = ['idle', 'started', 'pending', 'finished']
      const status = statuses[statuses.findIndex(ele => ele === table.status) + 1]

      try {
        if (status) {
          await axios.put(
            `/api/staff/table/${table._id}`,
            { status }
          )
        } else {
          await axios.put(
            `/api/staff/table/${table._id}`,
            { status: 'finished' }
          )
        }

        const res = await axios.get(`/api/staff/table?status=${table.status}`)
        setTables(res.data)
        notifySuccess(`Order Status Updated。Order Status："${status.charAt(0).toUpperCase() + status.slice(1)}"`)
      } catch (e) {
        notifyAxiosError(e)
      }


    },
    []
  )

  const changeTableStatus = React.useCallback(
    async (status: string) => {
      try {
        status = status.toLowerCase()

        const res = await axios.put(
          `/api/staff/table/${selectedTable._id}`,
          { status }
        )

        setSelectedTable({
          ...selectedTable,
          status: res.data.status
        })

        setTables((await axios.get(`/api/staff/table?status=${currentStatus}`)).data)

        notifySuccess(`Order Status Updated。Order Status："${status.charAt(0).toUpperCase() + status.slice(1)}"`)
      } catch (e) {
        notifyAxiosError(e)
      }

    },
    [selectedTable, currentStatus]
  )

  return (
    <>
      <StaffTablePageWrapper>
        <AlertModal
          isShowing={!!alertNumber}
          onSubmit={handleAlertCancel}
          onCancel={handleAlertCancel}
        >
          <>{t('Table Number')}<b>{alertNumber}</b> {t('Do you want to complete it?')}</>
        </AlertModal>
        <HeaderContainer>
          <StaffModeContainer>
            <Button onClick={() => history.push('/staff/order')}>{t('Order')}</Button>
            <Button color={color.white} backgroundColor={color.blue}>{t('Table')}</Button>
          </StaffModeContainer>
        </HeaderContainer>

        <InnerContainer>
          <StaffProcessContainer>
          <Button
              size="small"
              onClick={() => handleChangeProcess('idle')}
              backgroundColor={currentStatus === 'idle' ? color.yellow : ''}
              color={currentStatus === 'idle' ? color.white : ''}
            >
              Open
            </Button>
            <Button
              size="small"
              onClick={() => handleChangeProcess('started')}
              backgroundColor={currentStatus === 'started' ? color.yellow : ''}
              color={currentStatus === 'started' ? color.white : ''}
            >
              Filled
            </Button>
            <Button
              size="small"
              onClick={() => handleChangeProcess('pending')}
              backgroundColor={currentStatus === 'pending' ? color.yellow : ''}
              color={currentStatus === 'pending' ? color.white : ''}
            >
              Finishing
            </Button>
          </StaffProcessContainer>
          {isLoading ?
            <StaffLoading /> :
            <>
              {tables.map(
                (table: Table) => (
                  <OrderBox key={table._id} number={table.label}>
                    <OrderBoxInner>
                      <ListOrderContainer onClick={() => setSelectedTable(table)}>
                        {table.label}
                      </ListOrderContainer>
                      {table.status === 'pending' &&
                        <OrderBoxActionContainer>
                          <StaffConfirmOrderButton onClick={() => handleChangeOrderStatus(table)}><IoMdCheckmarkCircle /></StaffConfirmOrderButton>
                        </OrderBoxActionContainer>
                      }
                    </OrderBoxInner>
                  </OrderBox>
                )
              )}
            </>
          }
        </InnerContainer>

      </StaffTablePageWrapper>
      <TableDetailModal
        isShowing={!!selectedTable._id}
        table={selectedTable}
        onCancel={() => setSelectedTable({} as Table)}
        changeTableStatus={changeTableStatus}
      />
    </>
  )
}

export { StaffTablePage }
