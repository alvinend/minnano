import React from 'react'
import styled from 'styled-components'
import { color } from '../../atoms/color'
import { FiShoppingBag } from 'react-icons/fi'
import { GiTable } from 'react-icons/gi'
import { useHistory } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

const ModeSelectorWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-around;
  width: 100%;
  height: 100vh;
  background-color: ${color.gray};

  & .main-icon {
    font-size: 210px;
  }
  
  & .mode-desc {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    text-align: center;
    padding: 0 40px;

    & > h1 {
      font-size: 62px;
    }
  }
`

const TableModeContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 60%;
  height: 700px;
  margin: 20px 0;
  padding: 0 5px;
  background-color: ${color.secondary};
  border: 2px ${color.lightGray} solid;
  border-radius: 5px;
	animation: slide-in-top 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;

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

  & .table-desc-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 49%;
    margin: 30px 0;
    border-left: 10px dotted ${color.black};
  }

  & .number-input-container{
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 51%
  }
`

const NumberModeContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 30%;
  height: 700px;
  margin: 20px 0;
  padding: 0 5px;
  background-color: ${color.secondary};
  border: 2px ${color.lightGray} solid;
  border-radius: 5px;
	animation: slide-in-top 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;

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

const NumberDisplay = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 380px;
  height: 100px;
  background-color: ${color.primary};
  border: 5px ${color.white} solid;
  color: ${color.black};
  font-size: 72px;
  font-weight: bold;
`

const DescWrapper = styled.div`
  display: flex;
  font-size: 24px;
`

const ButtonWrapper = styled.div`
  display:flex;
  justify-content: flex-start;

  & > div {
    display:flex;
    justify-content: center;
    align-items: center;
    min-width: 380px;
  }
`

const ButtonGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 420px;
  margin-top: 30px;
  margin-left: 30px;

  & button {
    width: 80px;
    height: 80px;
    border: 2px #eee solid;
    background: ${color.lightGray};
    color: ${color.black};
    font-size: 24px;
    margin-bottom: 30px;
    margin-right: 30px;
    padding: 8px 0;
    font-size: 24px;
    font-weight: bold;

    &:hover {
      color: #333;
      background-color: ${color.lightGray};
    }

    &:active {
      background-color: white;
      transform: translateY(4px);
    }

    &:disabled {
      background-color: ${color.white};
      color: ${color.gray};

      &:hover {
        color: ${color.gray};
      }
    }
  }
`

type iModeSelectorPage = {
  onSetTable: (label: string) => void
}

const ModeSelectorPage: React.FC<iModeSelectorPage> = ({
  onSetTable
}) => {
  const history = useHistory()
  const [number, setNumber] = React.useState('')
  const { t: rawT } = useTranslation('customer')

  const t = React.useCallback(
    (str: string) => rawT(`ModeSelectorPage.${str}`),
    [rawT]
  )

  const inputNumber = React.useCallback(
    input => () => setNumber(`${number}${input}`),
    [number]
  )

  const delNumber = React.useCallback(
    () => setNumber(number.slice(0, -1)),
    [number]
  )

  const handleOrder = React.useCallback(
    async () => {
      await onSetTable(`T${number}`)
      history.push('/customer/idle')
    },
    [number, onSetTable, history]
  )

  const handleNoTable = React.useCallback(
    () => {
      history.push('/customer/idle')
    },
    [history]
  )


  return (
    <ModeSelectorWrapper>
      <TableModeContainer>
        <div className="number-input-container">
          <DescWrapper>
            {t('Please enter the table number')}
          </DescWrapper>
          <NumberDisplay>{number}</NumberDisplay>
          <ButtonWrapper>
            <ButtonGroup>
              <button onClick={inputNumber(1)} disabled={number.length === 3}>1</button>
              <button onClick={inputNumber(2)} disabled={number.length === 3}>2</button>
              <button onClick={inputNumber(3)} disabled={number.length === 3}>3</button>
              <button onClick={inputNumber(4)} disabled={number.length === 3}>4</button>
              <button onClick={inputNumber(5)} disabled={number.length === 3}>5</button>
              <button onClick={inputNumber(6)} disabled={number.length === 3}>6</button>
              <button onClick={inputNumber(7)} disabled={number.length === 3}>7</button>
              <button onClick={inputNumber(8)} disabled={number.length === 3}>8</button>
              <button onClick={inputNumber(9)} disabled={number.length === 3}>9</button>
              <button onClick={delNumber} disabled={!number.length}>DEL</button>
              <button onClick={inputNumber(0)} disabled={number.length === 3}>0</button>
              <button onClick={handleOrder} disabled={number.length !== 3}>OK</button>
            </ButtonGroup>
          </ButtonWrapper>
        </div>
        <div className="table-desc-container">
          <span className="main-icon">
            <GiTable />
          </span>
          <div className="mode-desc">
            <h1>{t('Table')}</h1>
            {t('Select this if you want to enable multiple orders in one session')} <br />
            {t('Enter the table number and press "OK"')}
          </div>
        </div>
      </TableModeContainer>

      <NumberModeContainer onClick={handleNoTable}>
        <span className="main-icon">
          <FiShoppingBag />
        </span>
        <div className="mode-desc">
          <h1>{t('Takeaway')}</h1>
          {t('Select this if you want this machine to accept a single order')}
        </div>
      </NumberModeContainer>
    </ModeSelectorWrapper>
  )
}

export { ModeSelectorPage }
