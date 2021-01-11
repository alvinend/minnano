import React from 'react'
import styled from 'styled-components'
import { color } from '../../atoms/color'
import { useHistory } from 'react-router-dom'
import { Layout, Table } from 'models/common'
import { FrostedBox } from 'components/atoms/FrostedBox'
import { FaAngleDoubleRight } from 'react-icons/fa'
import { useTranslation } from 'react-i18next'

const IdleWrapper = styled.div<{ type: string }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100vw;
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
`

const IdleContainer = styled.div`
  display: flex;
  flex-direction: row-reverse;
  width: 100%;
  height: 100%;
  background-image: url('https://minnanoonline.s3-ap-northeast-1.amazonaws.com/GettyImages-1154797812-2000.jpeg');

  & .desc-container {
    position: relative;
    width: 800px;
    padding: 40px;
    font-weight: bold;

    & .idle-greeting {
      font-size: 48px;
      font-weight: bold;
    }

    & .idle-storename {
      font-size: 72px;
      font-weight: bold;
    }

    & .idle-start {
      position: absolute;
      right: 60px;
      bottom: 60px;
      display: flex;
      align-items: center;
      font-size: 48px;
      animation: heartbeat 3s infinite;

      @keyframes heartbeat {
        0%
        {
          transform: scaleX( .8 );
        }
        50%
        {
          transform: scaleX( 1 );
        }
        100%
        {
          transform: scaleX( 0.8 );
        }
      }


      & > span {
        display: inherit;
        margin-left: 20px;
        font-size: 60px;
      }
    }
  }
`

type iIdlePage = {
  table: Table | undefined
  layout: Layout
  onSetTableStatus: (status: string) => void
}

const IdlePage: React.FC<iIdlePage> = ({
  layout,
  table,
  onSetTableStatus
}) => {
  const animationType = React.useMemo(
    () => 'in',
    []
  )

  const history = useHistory()
  const { t: rawT } = useTranslation('customer')

  const t = React.useCallback(
    (str: string) => rawT(`IdlePage.${str}`),
    [rawT]
  )

  const handleStartOrdering = React.useCallback(
    async () => {
      await onSetTableStatus('started')
      history.push('/customer/catalog')
    },
    [history, onSetTableStatus]
  )

  const l = React.useMemo(
    () => layout?.idle,
    [layout]
  )

  return (
    <IdleWrapper type={animationType}>
      <IdleContainer>
        <FrostedBox className="desc-container">
          <h2 className="idle-greeting">{l?.greeting}</h2>
          <h1 className="idle-storename">{layout?.storename}</h1>
          {table &&
            <p className="idle-desc">
              {t('Table Number')} {table.label?.substring(1)}
            </p>
          }

          <div className="idle-start" onClick={handleStartOrdering}>
            {l?.startButton}
            <span><FaAngleDoubleRight /></span>
          </div>
        </FrostedBox>
      </IdleContainer>
    </IdleWrapper>
  )
}

export { IdlePage }
