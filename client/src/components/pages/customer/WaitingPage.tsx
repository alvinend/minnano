import React from 'react'
import styled from 'styled-components'
import { color } from '../../atoms/color'
import { Layout, Table } from 'models/common'
import axios from 'axios'
import { useTranslation } from 'react-i18next'

const WaitingWrapper = styled.div<{ type: string }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100vh;
  background-color: ${color.lightGray};
  font-size: 24px;
  animation: ${({ type }) => type === 'in' ? 'tracking-in-expand 0.7s cubic-bezier(0.215, 0.610, 0.355, 1.000) both' :
    type === 'out' && 'tracking-out-contract 0.7s cubic-bezier(0.550, 0.085, 0.680, 0.530) both'};

  @keyframes tracking-in-expand {
    0% {
      letter-spacing: -0.5em;
      opacity: 0;
    }
    40% {
      opacity: 0.6;
    }
    100% {
      opacity: 1;
    }
  }

  @keyframes tracking-out-contract {
    0% {
      opacity: 1;
    }
    50% {
      opacity: 1;
    }
    100% {
      letter-spacing: -0.5em;
      opacity: 0;
    }
  }

  & h1 {
    text-align: center;
    font-size: 36px;
  }
  
  & h2 {
    font-size: 48px;
  }
`

type iWaitingPage = {
  resetState: () => void
  layout: Layout
  table: Table
  resetTable: () => void
}

const WaitingPage: React.FC<iWaitingPage> = ({
  resetState,
  layout,
  table,
  resetTable
}) => {
  const animationType = React.useMemo(
    () => 'in',
    []
  )

  const { t: rawT } = useTranslation('customer')

  const t = React.useCallback(
    (str: string) => rawT(`WaitingPage.${str}`),
    [rawT]
  )

  const l = React.useMemo(
    () => layout?.waiting,
    [layout]
  )

  React.useEffect(
    () => {
      resetState()
      const fetchInterval = setInterval(
        async () => {
          const res = await axios.get(`/api/customer/table/${table._id}/status`)

          console.log(res?.data?.status)

          if (res?.data?.status === 'finished') {
            resetTable()
            resetState()
            clearInterval(fetchInterval)
          }
        },
        5000
      )

      return () => { clearInterval(fetchInterval) }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  return (
    <WaitingWrapper type={animationType}>
      <h2>{l?.closing}</h2>
      <h1>{l?.instruction}</h1>
      <p>{t('Table Number')} {table?.label.substring(1)}</p>
    </WaitingWrapper>
  )
}

export { WaitingPage }
