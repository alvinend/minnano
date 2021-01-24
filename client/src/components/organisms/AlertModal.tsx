import React from 'react'
import styled from 'styled-components'
import { color } from '../atoms/color'
import { IoMdCheckmarkCircle, IoMdCloseCircle } from 'react-icons/io'

const ModalWrapper = styled.div`
  position: fixed;
  display: flex;
  width: 100vw;
  height: 100vh;
  z-index: 3;
  align-items: center;
  justify-content: center;
`

const Overlay = styled.div<{ type: string }>`
  position: fixed;
  display: flex;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.7);
  animation: ${({ type }) => type === 'in' ?
    'scale-in-ver-center 0.2s cubic-bezier(0.250, 0.460, 0.450, 0.940) both' :
    type === 'out' && 'scale-out-ver-center 0.2s cubic-bezier(0.250, 0.460, 0.450, 0.940) both'
  };

  @keyframes scale-in-ver-center {
    0% {
      transform: scaleY(0);
      opacity: 1;
    }

    100% {
      transform: scaleY(1);
      opacity: 1;
    }
  }

  @keyframes scale-out-ver-center {
    0% {
      transform: scaleY(1);
      opacity: 1;
    }

    100% {
      transform: scaleY(0);
      opacity: 1;
    }
  }
`

const Modal = styled.div<{ type: string }>`
  width: 600px;
  height: 200px;
  padding: 20px;
  background-color: ${color.white};
  font-size: 24px;
  text-align: center;
  z-index: 3;
  animation: ${({ type }) => type === 'in' ?
    'slide-in-bck-center 0.2s cubic-bezier(0.250, 0.460, 0.450, 0.940) both' :
    type === 'out' && 'slide-out-bck-center 0.2s cubic-bezier(0.250, 0.460, 0.450, 0.940) both'
  };

  @keyframes slide-in-bck-center {
    0% {
      transform: translateZ(600px);
      opacity: 0;
    }

    100% {
      transform: translateZ(0);
      opacity: 1;
    }
  }

  @keyframes slide-out-bck-center {
    0% {
      transform: translateZ(0);
      opacity: 1;
    }
  
    100% {
      transform: translateZ(600px);
      opacity: 0;
    }
  }
`

const ButtonContainer = styled.div`
  display: flex;
  font-size: 60px;
  margin-top: 30px;
  justify-content: space-around;

  & div:first-child {
    color: ${color.green};
  }

  & div:last-child {
    color: ${color.red};
  }
`

type iAlertModal = {
  isShowing: boolean
  onSubmit: () => void
  onCancel: () => void
  children: JSX.Element | string
}

export const AlertModal: React.FC<iAlertModal> = ({
  isShowing,
  onSubmit,
  onCancel,
  children
}) => {
  const [animationType, setAnimationType] = React.useState('in')

  const handleCloseModal = React.useCallback(
    () => {
      setAnimationType('out')
      setTimeout(() => {
        setAnimationType('in')
        onCancel()
      }, 1000)
    },
    [onCancel]
  )

  return isShowing ? (
    <ModalWrapper>
      <Overlay onClick={handleCloseModal} type={animationType} />
      <Modal type={animationType}>
        {children}
        <ButtonContainer>
          <div onClick={onSubmit}><IoMdCheckmarkCircle /></div>
          <div onClick={handleCloseModal}><IoMdCloseCircle /></div>
        </ButtonContainer>
      </Modal>
    </ModalWrapper>
  ) : null
}
