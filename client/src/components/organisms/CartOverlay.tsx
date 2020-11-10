import React from 'react'
import styled from 'styled-components'
import { TiShoppingCart, TiPlusOutline, TiMinusOutline } from 'react-icons/ti'
import { color } from '../atoms/color'
import { Cart, Layout } from '../../models/common'

const Overlay = styled.div<{ type: string }>`
  display: flex;
  align-items: center;
  flex-direction: column;
  position: fixed;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.9);
  z-index: 10;
  color: #eee;
  animation: ${({ type }) => type === 'in' ? 
    'scale-in-ver-top 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both' :
    type === 'out' && 'scale-out-ver-top 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both'
  };

  @keyframes scale-in-ver-top {
    0% {
      transform: scaleY(0);
      transform-origin: 100% 0%;
      opacity: 1;
    }
    100% {
      transform: scaleY(1);
      transform-origin: 100% 0%;
      opacity: 1;
    }
  }

  @keyframes scale-out-ver-top {
    0% {
      transform: scaleY(1);
      transform-origin: 100% 0%;
      opacity: 1;
    }

    100% {
      transform: scaleY(0);
      transform-origin: 100% 0%;
      opacity: 1;
    }
  }

`

const OverlayInnerContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 80%;
`

const IconContainer = styled.div`
  width: 100%;
  font-size: 72px;
  border-bottom: 5px #eee dotted;
  text-align: center;

  & div {
    font-size: 32px;
    margin-bottom: 20px;
  }
`

const ItemWrapper = styled.div`
  padding: 20px;
  font-size: 32px;
  font-weight: bold;
  
  & > div {
    margin: 10px 0;
  }
`

const ItemName = styled.div`
  display: inline-block;
  width: 50%;
`

const Quantitiy = styled.div`
  display: inline-block;
  width: 180px;
  margin-right: 30px;
  text-align: center;

  & button {
    border: 0;
    background: inherit;
    color: #eee;
    font-size: 24px;
    margin: 0 5px;
  }
`

const ItemPrice = styled.div`
  display: inline-block;
  width: calc(50% - 210px);
  text-align: right;
`

const TotalPriceContainer = styled.div`
  display: flex;
  width: 100%;
  padding: 20px;
  border-top: 5px #eee dotted;
  font-size: 32px;
  font-weight: bold;
`
const TotalPriceDesc = styled.div`
  display: inline-block;
  width: 100px;
`

const TotalPrice = styled.div`
  display: flex;
  flex-direction: column;
  width: calc(100% - 100px);
  text-align: right;
  align-items: flex-end;
  margin-bottom: 15px;

  & button {
    width: 300px;
    border: 2px #eee solid;
    background: inherit;
    color: #eee;
    font-size: 24px;
    margin-top: 20px;
    padding: 8px 0;
    font-size: 24px;
    font-weight: bold;

    &:hover {
      background-color: red;
    }

    &:last-child:hover {
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

type iCartOverlay = {
  cart: Cart
  setCart: React.Dispatch<any>
  totalPrice: number
  onClickBack: () => void
  onClickConfirmed: () => void
  animationType: string
  layout: Layout
}

export const CartOverlay: React.FC<iCartOverlay> = ({
  cart,
  setCart,
  totalPrice,
  onClickBack,
  onClickConfirmed,
  animationType,
  layout
}) => {
  const handleAddItem = React.useCallback(
    (index: number) => {
      let newCart = cart
      newCart[index].quantity += 1
      setCart([...newCart])
    },
    [cart, setCart]
  )

  const handleDeleteItem = React.useCallback(
    (index: number) => {
      let newCart = cart
      if (newCart[index].quantity === 1) {
        newCart.splice(index, 1) 
      } else {
        newCart[index].quantity -= 1
      }

      setCart([...newCart])
    },
    [cart, setCart]
  )

  return (
    <Overlay type={animationType}>
      <OverlayInnerContainer>
        <IconContainer>
          <TiShoppingCart />
          <div>{layout.confirmation.desc}</div>
        </IconContainer>
        <ItemWrapper>
          {!cart.length && 'Cart is Empty'}
          {cart.map(
            (cartItem, index) => (
              <div
                key={`${cartItem.item.id}-${index}`}
              >
                <ItemName>{cartItem.item.name}</ItemName>
              <Quantitiy>
                <button onClick={() => handleDeleteItem(index)}><TiMinusOutline/></button>
                x{cartItem.quantity}
                <button onClick={() => handleAddItem(index)}><TiPlusOutline/></button>
              </Quantitiy>
              <ItemPrice>{(cartItem.quantity * cartItem.item.price).toLocaleString()}円</ItemPrice>
              </div>
            )
          )}
        </ItemWrapper>
        <TotalPriceContainer>
          <TotalPriceDesc>合計金額</TotalPriceDesc>
          <TotalPrice>
            <span>{totalPrice.toLocaleString()}円</span>
            <button onClick={onClickBack}>戻る</button>
            <button disabled={!cart.length} onClick={onClickConfirmed}>{layout.confirmation.button}</button>
          </TotalPrice>
        </TotalPriceContainer>
      </OverlayInnerContainer>
    </Overlay>
  )
}
