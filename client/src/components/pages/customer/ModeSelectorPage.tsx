import React from 'react'
import styled from 'styled-components'
import { color } from '../../atoms/color'
import { FiShoppingBag } from 'react-icons/fi'
import { GiTable } from 'react-icons/gi'
import { useHistory } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import dineInLogo from 'components/img/dine_in_logo.png'
import takeawayLogo from 'components/img/takeaway_logo.png'

const ModeSelectorWrapper = styled.div`
  display: flex;
  width: 100%;
  height: 100vh;


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
  }
`

const TableModeContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 60%;
  height: 100%;
  background-color: ${color.yellow};

  & .table-desc-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    width: 49%;
    padding: 50px 50px 0 50px;
    margin: 20px 0;

    & > img {
      width: 300px;
    }

    & > h1 {
      font-size: 48px;
      font-weight: 700;
      line-height: 0.8;
    }
  }
`

const TableModeInnerContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 900px;
  height: 600px;
  margin: 20px 0;
  background-color: ${color.secondary};
  border: 2px ${color.lightGray} solid;
  border-radius: 25px;
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

const NumberInputContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 51%;
  padding-top: 20px;
  padding-bottom: 10px;
  background-color: ${color.white};
  border-radius: 25px 0 0 25px;
`

const OrderModeContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 40%;
  height: 100%;
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

const OrderModeInnerContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  width: 350px;
  height: 600px;
  margin: 20px 0;
  padding-top: 80px;
  background-color: ${color.white};
  border-radius: 25px;
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

  & > img {
    width: 300px;
  }

  & > h1 {
    font-size: 48px;
    font-weight: 700;
    line-height: 0.8;
  }
`

const NumberDisplay = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 300px;
  height: 65px;
  background-color: ${color.white};
  border: 2px solid ${color.black};
  color: ${color.black};
  font-size: 48px;
  border-radius: 15px;
  font-weight: bold;
`

const ButtonWrapper = styled.div`
  display:flex;
  justify-content: center;
  width: 320px;
`

const ButtonGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-top: 30px;
  margin-left: 30px;

  & button {
    width: 70px;
    height: 70px;
    border: 1px solid ${color.black};
    background: ${color.white};
    color: ${color.black};
    font-size: 28px;
    margin-bottom: 20px;
    margin-right: 20px;
    font-weight: bold;
    border-radius: 15px;

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
        <TableModeInnerContainer>
          <NumberInputContainer>
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
          </NumberInputContainer>
          <div className="table-desc-container">
            <img src={dineInLogo} />
            <h1>DINE IN</h1>
            <div className="mode-desc">
              {t('Select this if you want to enable multiple orders in one session')} <br />
              {t('Enter the table number and press "OK"')}
            </div>
          </div>
        </TableModeInnerContainer>
      </TableModeContainer>

      <OrderModeContainer onClick={handleNoTable}>
        <OrderModeInnerContainer>
          <img src={takeawayLogo} />
          <h1>{t('Takeaway')}</h1>
          <div className="mode-desc">
            {t('Select this if you want this machine to accept a single order')}
          </div>
        </OrderModeInnerContainer>
      </OrderModeContainer>
    </ModeSelectorWrapper>
  )
}

export { ModeSelectorPage }
