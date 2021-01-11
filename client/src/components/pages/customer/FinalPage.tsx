import React from 'react'
import styled from 'styled-components'
import { color } from '../../atoms/color'
import { useHistory } from 'react-router-dom'
import { Layout, Table } from 'models/common'

const FinalWrapper = styled.div<{ type: string }>`
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
    font-size: 72px;
  }
  
  & h2 {
    font-size: 48px;
  }
`

type iFinalPage = {
  cartNumber: string
  resetState: () => void
  layout: Layout
  table: Table | undefined
}

const FinalPage: React.FC<iFinalPage> = ({
  cartNumber,
  resetState,
  layout,
  table
}) => {
  const [animationType, setAnimationType] = React.useState('in')
  const history = useHistory()

  React.useEffect(
    () => {
      resetState()

      setTimeout(
        () => setAnimationType('out'),
        3000
      )

      setTimeout(
        () => history.push(table ? '/customer/catalog' : '/customer/idle'),
        3750
      )
    },
    [history, resetState, table]
  )

  const finalLayout = React.useMemo(
    () => layout.final,
    [layout]
  )

  return (
    <FinalWrapper type={animationType}>
      <h2>{finalLayout.main}</h2>
      <h1>"{cartNumber}"</h1>
      {finalLayout.desc}
    </FinalWrapper>
  )
}

export { FinalPage }
