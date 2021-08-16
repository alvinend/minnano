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
  font-weight: bold;

  & span {
    text-align: right;
  }
`

const OrderBoxActionContainer = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  text-align: center;
  border-top: 5px ${color.gray} dotted;
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
          <>{t('Order Number')}<b>{alertNumber}</b> {t('Do you want to complete it?')}</>
        </AlertModal>
        <HeaderContainer>
          <div className="mode-container">
            <span onClick={() => history.push('/staff/order')}>{t('Order')}</span>
            <span className="active-mode">{t('Table')}</span>
          </div>

          <div className="process-container">
            <span
              onClick={() => handleChangeProcess('idle')}
              className={currentStatus === 'idle' ? 'active-process' : ''}
            >
              {t('Idle')}
            </span>
            <span className="process-arrow"><FaAngleDoubleRight /></span>
            <span
              onClick={() => handleChangeProcess('started')}
              className={currentStatus === 'started' ? 'active-process' : ''}
            >
              {t('Started')}
            </span>
            <span className="process-arrow"><FaAngleDoubleRight /></span>
            <span
              onClick={() => handleChangeProcess('pending')}
              className={currentStatus === 'pending' ? 'active-process' : ''}
            >
              {t('Pending')}
            </span>
          </div>
        </HeaderContainer>
        <InnerContainer>
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
                          <div onClick={() => handleChangeOrderStatus(table)}><IoMdCheckmarkCircle /></div>
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
