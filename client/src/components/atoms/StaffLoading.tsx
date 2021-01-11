import React from 'react'
import styled from 'styled-components'
import { color } from './color'

const LoadingWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
`

const LoadingIcon = styled.div`
  margin-right: 20px;
  display: inline-block;
  transform: translateZ(1px);
  
  & > div {
    display: inline-block;
    width: 64px;
    height: 64px;
    margin: 8px;
    border-radius: 50%;
    background:  ${color.black};
    animation: lds-circle 2.4s cubic-bezier(0, 0.2, 0.8, 1) infinite;
  }

  @keyframes lds-circle {
    0%, 100% {
      animation-timing-function: cubic-bezier(0.5, 0, 1, 0.5);
    }
    0% {
      transform: rotateY(0deg);
    }
    50% {
      transform: rotateY(1800deg);
      animation-timing-function: cubic-bezier(0, 0.5, 0.5, 1);
    }
    100% {
      transform: rotateY(3600deg);
    }
  }
`

const LoadingTextContainer = styled.div`
  display: flex;
  flex-direction: row;

  & p {
    font-size: 24px;
    font-weight: normal;
    letter-spacing: 4px;
    text-transform: uppercase;
    color: ${color.black};
    animation-name: bounce;
    animation-duration: 2s;
    animation-iteration-count: infinite;

    &:nth-child(2) {
      animation-delay: 0.1s;
    }
    
    &:nth-child(3) {
      animation-delay: 0.2s;
    }

    &:nth-child(4) {
      animation-delay: 0.3s;
    }

    &:nth-child(5) {
      animation-delay: 0.4s;
    }

    &:nth-child(6) {
      animation-delay: 0.5s;
    }

    &:nth-child(7) {
      animation-delay: 0.6s;
    }

    &:nth-child(8) {
      animation-delay: 0.8s;
    }

    &:nth-child(9) {
      animation-delay: 1s;
    }

    &:nth-child(10) {
      animation-delay: 1.2s;
    }
  }

  @keyframes bounce {
    0% {
      transform: translateY(0px);
    }
    40% {
      transform: translateY(-40px);
    }
    80%,
    100% {
      transform: translateY(0px);
    }
  }

`

const StaffLoading = () => {
  return (
    <LoadingWrapper>
      <LoadingIcon><div></div></LoadingIcon>
      <LoadingTextContainer>
        <p>L</p>
        <p>o</p>
        <p>a</p>
        <p>d</p>
        <p>i</p>
        <p>n</p>
        <p>g</p>
        <p>.</p>
        <p>.</p>
        <p>.</p>
      </LoadingTextContainer>
    </LoadingWrapper>
  )
}

export { StaffLoading }
