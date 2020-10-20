import React from 'react'
import styled from 'styled-components'
import { color } from '../../atoms/color'

const CategoryWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  background-color: ${color.lightGray};
`

const InnerContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 90%;
  height: calc(100vh - 40px);
  margin: 20px 0;
  padding: 0 5px;
  background-color: ${color.secondary};
  border: 2px ${color.gray} solid;
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

const NumberDispaly = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 380px;
  height: 200px;
  background-color: ${color.primary};
  border: 5px ${color.white} solid;
  color: ${color.black};
  font-size: 100px;
  font-weight: bold;
  margin-left: 80px;
`

const DescWrapper = styled.div`
  display: flex;
  width: 90%;
  margin: 20px 30px 0 30px;
  font-size: 24px;

  & div:first-child {
    width: calc(100% - 420px);
    height: 100px;
    color: ${color.black};
    font-weight: bold;
  }
`

const ButtonWrapper = styled.div`
  display:flex;
  justify-content: flex-start;
  width: 100%;

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

type iNumberPage = {
  onSendOrder: (number: string) => void
}

const NumberPage:React.FC<iNumberPage> = ({
  onSendOrder
}) => {

  const [number, setNumber] = React.useState('')

  const inputNumber = React.useCallback(
    input => () => setNumber(`${number}${input}`),
    [number]
  )
  
  const delNumber = React.useCallback(
    () => setNumber(number.slice(0, -1)),
    [number]
  )

  const handleOrder = React.useCallback(
    () => {
      onSendOrder(number)
    },
    [number, onSendOrder]
  )


  return (
    <CategoryWrapper>
      <InnerContainer>
        <DescWrapper>
          <div>
            Masukan Nomer Meja disini. Makanan akan segera diproses setelah melakukan pesanan <br />
            Prediksi waktu sekitar 15 menit
          </div>
          <NumberDispaly>{number}</NumberDispaly>
        </DescWrapper>
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
      </InnerContainer>
    </CategoryWrapper>
  )
}

export { NumberPage }
