import { Layout } from 'models/common'
import React from 'react'
import styled from 'styled-components'
import { color } from '../../atoms/color'

const CategoryWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0);
  /* background: linear-gradient(334deg, ${color.blue} 0%, ${color.blue} 50%, rgba(0, 0, 0, 0) 50%, rgba(0, 0, 0, 0) 100%); */
`

const OuterContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 700px;
  height: 620px;
	animation: slide-in-top 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
  overflow: hidden;

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

const InnerContainer = styled.div`
  display: flex;
  width: 100%;
  height: 450px;
`

const NumberDisplay = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 75%;
  height: 65px;
  background-color: ${color.white};
  border: 2px solid ${color.black};
  color: ${color.black};
  font-size: 48px;
  border-radius: 15px;
  font-weight: bold;
  margin-top: 20px;
`

const DescWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 50%;
  height: 100%;
  background-color: ${color.blue};
  border-radius: 25px;
`

const DescHeader = styled.h1`
  font-size: 40px;
  font-weight: 700;
  line-height: 1;
  margin-bottom: 10px;
  color: ${color.white};
`

const DescItem = styled.div<{ number: number }>`
  position: relative;
  display: flex;
  align-items: center;
  width: 70%;
  max-width: 270px;
  height: 80px;
  font-size: 16px;
  background-color: ${color.white};
  border-radius: 25px;
  padding: 0 15px 0 40px;
  font-weight: 700;
  margin-left: 30px;

  &:not(:first-child) {
    margin-top: 20px;
  }

  &::before {
    ${({ number }) => `content: '${number}';`}
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 30px;
    position: absolute;
    top: calc(50% - 30px);
    left: -30px;
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background-color: ${color.white};
    box-shadow: 2px 1px 2px 2px rgba(0,0,0,0.4);
  }
`

const ButtonWrapper = styled.div`
  display:flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  width: 50%;
  height: 100%;
  background-color: rgba(249, 249, 249, 0.6);
  border-radius: 25px;
`

const ButtonGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-top: 30px;
  width: 270px;
  margin-right: -60px;

  & button {
    width: 60px;
    height: 60px;
    border: 1px solid ${color.black};
    background: ${color.white};
    color: ${color.black};
    font-size: 24px;
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

const Footer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 60px;
  padding: 0 25px;
  background-color: ${color.white};
  border-radius: 25px;
  font-size: 20px;
  font-weight: 700;
`

type iNumberPage = {
  onSendOrder: (number: string) => void
  layout: Layout
}

const NumberPage: React.FC<iNumberPage> = ({
  onSendOrder,
  layout
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

  const VideoContainer = styled.div`
    position: fixed;
    top: 0;
    bottom: 0;
    width: 100% !important;
    height: 100% !important;
    overflow: hidden;
    z-index: -1;
    object-fit: cover;

    & > video {
      width: 100% !important;
      height: 100% !important;
      object-fit: cover;
    }
  `

  return (
    <>
      <VideoContainer>
        <video autoPlay={true} loop={true} muted={true}>
          <source src="https://minnanoonline.s3.ap-northeast-1.amazonaws.com/number_page_background.mp4" type="video/mp4"/>
        </video>
      </VideoContainer>
      <CategoryWrapper>
        <OuterContainer>
          <InnerContainer>
            <ButtonWrapper>
              <NumberDisplay>{number}</NumberDisplay>
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
            <DescWrapper>
              <DescHeader>STEPS</DescHeader>
              <DescItem number={1}>
                Take the number that is on the right of this machine.
              </DescItem>
              <DescItem number={2}>
                Enter the number on this machine.
              </DescItem>
              <DescItem number={3}>
                We will call the number if the order is completed.
              </DescItem>
            </DescWrapper>
          </InnerContainer>
          <Footer>
            <span>Total: 100 USD</span>
            <span>Time Estimation: 15 Minutes</span>
          </Footer>
        </OuterContainer>
      </CategoryWrapper>
    </>
  )
}

export { NumberPage }
