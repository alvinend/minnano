import React from 'react'
import styled from 'styled-components'
import { color } from '../../atoms/color'
import { useHistory } from 'react-router-dom'
import { Layout, Table } from 'models/common'
import { FrostedBox } from 'components/atoms/FrostedBox'
import { FaAngleDoubleRight } from 'react-icons/fa'
import { useTranslation } from 'react-i18next'
import { Button } from 'components/atoms/button'

const IdleLeftContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-left: 8vw;
  width: 50%;
  font-size: 2vw;
`

const WelcomeText = styled.span`
  font-size: 5vw;
  font-weight: 700;
  margin-bottom: 2vw;
`

const IdleWrapper = styled.div<{ type: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100vw;
  height: 100vh;
  background-color: ${color.white};
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

const IdleRightContainer = styled.div<{ backgroundUrl: string }>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 50%;
  height: 100%;
  padding-right: 8vw;
  background-size: cover;
  background-color: ${color.white};

  & > img {
    width: 30vw;
    height: 30vw;
    object-fit: cover;
    border-radius: 50%;
    margin-bottom: 5vw;
  }

  & > button {
    font-size: 2.5vw;
    height: 10vh;
    width: 22vw;
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
      <IdleLeftContainer>
        <WelcomeText>Welcome</WelcomeText>
        <h2 className="idle-greeting">{l?.greeting}</h2>
        <h1 className="idle-storename">{layout?.storename}</h1>
        {table &&
          <p className="idle-desc">
            {t('Table Number')} {table.label?.substring(1)}
          </p>
        }

      </IdleLeftContainer>
      <IdleRightContainer backgroundUrl={l?.backgroundUrl}>
        <img src={l?.backgroundUrl} alt="Idle Page Backgound Image" />
        <Button onClick={handleStartOrdering} backgroundColor={color.yellow} color={color.white}>
          {l?.startButton}
        </Button>
      </IdleRightContainer>
    </IdleWrapper>
  )
}

export { IdlePage }
