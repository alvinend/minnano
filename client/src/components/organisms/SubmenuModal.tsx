import React from 'react'
import styled from 'styled-components'
import { color } from '../atoms/color'
import { Item, Cart, Subitem } from 'models/common'
import { FrostedBox } from 'components/atoms/FrostedBox'
import { AiFillPlusCircle, AiFillMinusCircle } from 'react-icons/ai'
import { RoundedButton } from 'components/atoms/button/RoundedButton'
import { RoundedButtonPrimary } from 'components/atoms/button/RoundedButtonPrimary'

const SubmenuModalWrapper = styled.div`
  position: fixed;
  display: flex;
  width: 100vw;
  height: 100vh;
  z-index: 2;
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

const StyledSubmenuModal = styled.div<{ type: string }>`
  display: flex;
  width: 80vw;
  height: 80vh;
  background-color: ${color.white};
  font-size: 24px;
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

const DetailContainer = styled.div`
  width: 40%;
  padding: 40px;
  background-color: ${color.primary};

  & > img {
    width: calc(100% + 80px);
    height: 30%;
    margin: -40px;
    object-fit: cover;
  }

  & > .title {
    font-size: 60px;
    font-weight: bold;
    -webkit-text-stroke: 4px ${color.primary};
  }

  & > .desc {
    height: 30%;
    overflow: auto;
  }
`

const VariationTitle = styled.h2`
  padding-bottom: 10px;
  margin-bottom: 10px;
  font-size: 36px;
  font-weight: bold;
  border-bottom: 10px dotted ${color.gray};
`

const VariationContainer = styled.div`
  width: 60%;
  padding: 40px;
  margin-top: 30px;
  
  & > .subitem-inner {
    display: flex;
    flex-wrap: wrap;
    align-content: flex-start;
    justify-content: space-between;
    width: 100%;
    height: 90%;
    margin-top: 20px;
    overflow: auto;

    & ${FrostedBox} {
      width: 48%;
      margin-bottom: 20px;
      transition: .3s all ease-in-out;

      &:hover {
        background: linear-gradient(130deg, ${color.pink} 0%, ${color.secondary} 100%);
        box-shadow: none;
        transition: .3s all ease-in-out;
        cursor: pointer;

        & .subitem-price {
          border: 2px solid ${color.black};
        }
      }
    }
  }

  & .subitem-title {
    display: flex;
    align-items: center;
    font-weight: bold;

    & > .subitem-price {
      margin-left: 20px;
      padding: 2px 8px;
      border-radius: 20px;
      border: 2px solid ${color.secondary};
      font-size: 16px;
    }
  }

  & .subitem-desc {
    font-size: 16px;
  }
`

const CartInfoContainer = styled.div`
  display: flex;
  align-items: center;

  & > .cart-name {
    width: 70%;
  }

  & .cart-quantity {
    display: flex;
    align-items: center;
    width: 30%;

    &-minus {
      color: ${color.red};
      font-size: 36px;
      line-height: 1;
    } 

    &-total {
      width: 80px;
      text-align: center;
    } 

    &-plus {
      color: ${color.green};
      font-size: 36px;
      line-height: 1;
    } 
  }
`

const CartInfoFooter = styled.div`
  border-top: 10px dotted ${color.black};
  padding: 20px;

  & .total-price {
    text-align: right;
    font-size: 18px;

    & > span {
      font-size: 36px;
      margin: 0 10px;
    }
  }

  & .button-container {
    display: flex;
    justify-content: space-around;
    margin: 20px 0;
  }

`

type iSubmenuModal = {
  isShowing: boolean
  onSubmit: (cart: Cart) => void
  onCancel: () => void
  item: Item
}

export const SubmenuModal: React.FC<iSubmenuModal> = ({
  isShowing,
  onSubmit,
  onCancel,
  item,
}) => {
  const [animationType, setAnimationType] = React.useState('in')
  const [cart, setCart] = React.useState([] as Cart)

  React.useEffect(
    () => {
      setCart([])
    },
    [isShowing]
  )

  const handleSubmit = React.useCallback(
    () => {
      onSubmit(cart)
    },
    [cart, onSubmit]
  )

  const handleAddCart = React.useCallback(
    (subitem: Subitem | Item) => {
      let newCart = cart
      const checkCart = cart.map(cartItem => cartItem.item._id)
      if (checkCart.indexOf(subitem._id) === -1) {
        newCart = cart.concat([{
          item: subitem,
          quantity: 1
        }])
      } else {
        newCart[checkCart.indexOf(subitem._id)].quantity += 1
      }

      setCart([...newCart])
    },
    [cart]
  )

  const handleRemoveCart = React.useCallback(
    (subitem: Subitem) => {
      let newCart = cart
      const index = cart.map(cartItem => cartItem.item._id).indexOf(subitem._id)

      if (newCart[index].quantity === 1) {
        newCart = newCart.filter(cartItem => cartItem.item._id !== subitem._id)
      } else {
        newCart[index].quantity -= 1
      }

      setCart([...newCart])
    },
    [cart]
  )


  const handleCloseSubmenuModal = React.useCallback(
    () => {
      setAnimationType('out')
      setTimeout(() => {
        setAnimationType('in')
        onCancel()
      }, 1000)
    },
    [onCancel]
  )

  const totalPrice = React.useMemo(
    () => cart.length && cart
      .map(cartItem => cartItem.item.price * cartItem.quantity)
      .reduce((a, b) => a + b),
    [cart]
  )

  return isShowing ? (
    <SubmenuModalWrapper>
      <Overlay onClick={handleCloseSubmenuModal} type={animationType} />
      <StyledSubmenuModal type={animationType}>
        <DetailContainer>
          <img src={`${item?.imagelink}`} alt="Item" />
          <h2 className="title">{item?.name}</h2>
          <p className="desc">
            {!!cart.length ?
              cart.map(({ item, quantity }) => <div>
                <CartInfoContainer key={`${item._id}-${quantity}`}>
                  <div className="cart-name">{item.name}</div>
                  <div className="cart-quantity">
                    <span
                      className="cart-quantity-minus"
                      onClick={() => handleRemoveCart(item as Subitem)}
                    >
                      <AiFillMinusCircle />
                    </span>
                    <span className="cart-quantity-total">{quantity}</span>
                    <span
                      className="cart-quantity-plus"
                      onClick={() => handleAddCart(item as Subitem)}
                    >
                      <AiFillPlusCircle />
                    </span>
                  </div>
                </CartInfoContainer>
              </div>)
              : item?.desc
            }
          </p>

          <CartInfoFooter>
            <div className="total-price">
              合計
              <span>{totalPrice}</span>
              円
            </div>
            <div className="button-container">
              <RoundedButton
                onClick={onCancel}
              >
                キャンセル
              </RoundedButton>
              <RoundedButtonPrimary
                disabled={!cart.length}
                onClick={handleSubmit}
              >
                カートに入れる
              </RoundedButtonPrimary>
            </div>
          </CartInfoFooter>

        </DetailContainer>
        <VariationContainer>
          <VariationTitle>
            種類
          </VariationTitle>
          <div className="subitem-inner">
            {!!item.subitems.length ? item?.subitems.map(subitem => (
              <FrostedBox
                key={subitem._id}
                onClick={() => handleAddCart(subitem)}
              >
                <h3 className="subitem-title">
                  {subitem.name}
                  <span className="subitem-price">{subitem.price}円</span>
                </h3>
                <p className="subitem-desc">{subitem.desc}</p>
              </FrostedBox>
            )) :
              <FrostedBox
                onClick={() => handleAddCart(item)}
              >
                <h3 className="subitem-title">
                  通常版
                <span className="subitem-price">{item.price}円</span>
                </h3>
                <p className="subitem-desc">{item.desc}</p>
              </FrostedBox>
            }
          </div>
        </VariationContainer>
      </StyledSubmenuModal>
    </SubmenuModalWrapper>
  ) : null
}
