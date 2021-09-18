import React from 'react'
import styled from 'styled-components'
import { color } from '../atoms/color'
import { Item, Cart, Subitem, Layout } from 'models/common'
import { FrostedBox } from 'components/atoms/FrostedBox'
import { AiFillPlusCircle, AiFillMinusCircle } from 'react-icons/ai'
import { RoundedButton } from 'components/atoms/button/RoundedButton'
import { RoundedButtonPrimary } from 'components/atoms/button/RoundedButtonPrimary'
import { useTranslation } from 'react-i18next'
import { Button } from 'components/atoms/button'

const SubmenuModalWrapper = styled.div`
  position: fixed;
  display: flex;
  top: 0;
  left: 0;
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
  border-radius: 25px;
  width: 80vw;
  height: 80vh;
  background-color: ${color.white};
  font-size: 16px;
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
  width: 35%;
  padding: 40px;
  border-radius: 25px 0 0 25px;
  background-color: ${color.secondary};

  & > .title {
    font-size: 24px;
    font-weight: 900;
  }

  & > .desc {
    height: calc(95% - 200px);
    overflow: auto;
  }
`

const VariationTitle = styled.h2`
  position: relative;
  padding-bottom: 20px;
  margin-bottom: 30px;
  font-size: 36px;
  font-weight: bold;
  
  & > img {
    position: absolute;
    right: 0;
    top: -20px;
    border-radius: 50%;
    object-fit: cover;
    width: 100px;
    height: 100px;
  }
`

const VariationContainer = styled.div`
  width: 65%;
  padding: 10px 40px;
  border-radius: 0 0 25px 0;
  margin-top: 30px;
  background-color: ${color.white};
  
  & > .subitem-inner {
    display: flex;
    flex-wrap: wrap;
    align-content: flex-start;
    justify-content: space-between;
    width: 100%;
    height: 80%;
    margin-top: 20px;
    overflow: auto;
  }

  & .subitem-title {
    display: flex;
    align-items: center;
    font-weight: bold;

    & > .subitem-price {
      margin-left: 20px;
      padding: 2px 8px;
      border-radius: 20px;
      border: 2px solid ${color.blue};
      font-size: 16px;
    }
  }

  & .subitem-desc {
    font-size: 16px;
  }
`

const ItemContainer = styled.div<{ isAvailable: boolean }>`
  position: relative;
  width: 48%;
  padding: 15px 20px;
  margin-bottom: 20px;
  transition: .3s all ease-in-out;
  border-radius: 25px;
  border: 1px solid ${color.yellow};
  ${({ isAvailable }) => !isAvailable && 'pointer-events: none;'}

  & > * {
    ${({ isAvailable }) => !isAvailable && 'opacity: 0.6;'}
  }

  &::after {
    content: 'Out of Stock';
    ${({ isAvailable }) => isAvailable && 'display: none;'}
    position: absolute;
    top: 20px;
    right: 20px;
    background-color: ${color.red};
    color: ${color.white};
    z-index: 1;
    padding: 5px 10px;
    font-size: 18px;
    font-weight: 700;
    border-radius: 15px;
  }

  &:hover {
    background: ${color.yellow};
    box-shadow: none;
    transition: .3s all ease-in-out;
    cursor: pointer;

    & .subitem-price {
      background-color: ${color.blue};
    }
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

const CartQuantityButton = styled.span<{ isOut?: boolean }>`
  display: flex;
  align-items: center;
  width: 30%;
  ${({ isOut }) => isOut && 'opacity: 0.6;'}
  ${({ isOut }) => isOut && 'pointer-events: none;'}

  &.minus {
    color: ${color.red};
    font-size: 36px;
    line-height: 1;
  } 

  &.total {
    width: 80px;
    text-align: center;
  } 

  &.plus {
    color: ${({ isOut }) => isOut ? color.gray : color.green};
    font-size: 36px;
    line-height: 1;
  } 
`

const CartInfoFooter = styled.div`
  border-top: 1px solid ${color.black};
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
    font-size: 16px;

    & > button {
      min-width: 30%;
    }
  }

`

type iSubmenuModal = {
  isShowing: boolean
  onSubmit: (cart: Cart) => void
  onCancel: () => void
  item: Item
  layout: Layout
  mainCart: Cart
}

export const SubmenuModal: React.FC<iSubmenuModal> = ({
  isShowing,
  onSubmit,
  onCancel,
  item,
  layout,
  mainCart
}) => {
  const [animationType, setAnimationType] = React.useState('in')
  const [cart, setCart] = React.useState([] as Cart)
  const { t: rawT } = useTranslation('customer')

  const t = React.useCallback(
    (str: string) => rawT(`SubmenuModal.${str}`),
    [rawT]
  )

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

  const checkStock = React.useCallback(
    subitem => {
      // If Item have no stock
      let itemCountInCart = 0

      // if Sub-Item have no stock
      let subitemCountInCart = 0

      mainCart.forEach(
        cartItem => {
          // @ts-expect-error
          if (cartItem.item._id === item._id || cartItem.item?.itemid === item._id) {
            itemCountInCart = itemCountInCart + cartItem.quantity
          }

          if (cartItem.item._id === subitem._id) {
            subitemCountInCart = subitemCountInCart + cartItem.quantity
          }
        }
      )

      cart.forEach(
        cartItem => {
          // @ts-expect-error
          if (cartItem.item._id === item._id || cartItem.item?.itemid === item._id) {
            itemCountInCart = itemCountInCart + cartItem.quantity
          }

          if (cartItem.item._id === subitem._id) {
            subitemCountInCart = subitemCountInCart + cartItem.quantity
          }
        }
      )

      // If Item have no stock
      if ((item?.stock || 0) - itemCountInCart === 0) { return false }
      // if Sub-Item have no stock
      if (subitem.stock - subitemCountInCart === 0) { return false } 
      return true
    },
    [mainCart, cart, item]
  )

  return isShowing ? (
    <SubmenuModalWrapper>
      <Overlay onClick={handleCloseSubmenuModal} type={animationType} />
      <StyledSubmenuModal type={animationType}>
        <DetailContainer>
          <h2 className="title">{item?.name}</h2>
          <div className="desc">
            {!!cart.length ?
              cart.map(({ item, quantity }) => <div>
                <CartInfoContainer key={`${item._id}-${quantity}`}>
                  <div className="cart-name">{item.name}</div>
                  <div className="cart-quantity">
                    <CartQuantityButton
                      className="minus"
                      onClick={() => handleRemoveCart(item as Subitem)}
                    >
                      <AiFillMinusCircle />
                    </CartQuantityButton>
                    <span className="cart-quantity-total">{quantity}</span>
                    <CartQuantityButton
                      className="plus"
                      onClick={() => handleAddCart(item as Subitem)}
                      isOut={!checkStock(item)}
                    >
                      <AiFillPlusCircle />
                    </CartQuantityButton>
                  </div>
                </CartInfoContainer>
              </div>)
              : item?.desc
            }
          </div>

          <CartInfoFooter>
            <div className="total-price">
              {t('Total')}
              <span>{totalPrice.toLocaleString()}</span>
              {layout.currency}
            </div>
            <div className="button-container">
              <Button
                onClick={onCancel}
              >
                {t('Cancel')}
              </Button>
              <Button
                disabled={!cart.length}
                onClick={handleSubmit}
                color={color.white}
                backgroundColor={color.green}
              >
                {t('Add to cart')}
              </Button>
            </div>
          </CartInfoFooter>

        </DetailContainer>
        <VariationContainer>
          <VariationTitle>
            {t('Variation')}
            <img src={`${item?.imagelink}`} alt="Item" />
          </VariationTitle>
          <div className="subitem-inner">
            {!!item.subitems.length ? item?.subitems.map(subitem => (
              <ItemContainer
                key={subitem._id}
                onClick={() => handleAddCart(subitem)}
                isAvailable={checkStock(subitem)}
              >
                <h3 className="subitem-title">
                  {subitem.name}
                  <span className="subitem-price">{subitem.price.toLocaleString()} {layout.currency}</span>
                </h3>
                <p className="subitem-desc">{subitem.desc}</p>
              </ItemContainer>
            )) :
              <ItemContainer
                onClick={() => handleAddCart(item)}
                isAvailable={checkStock(item)}
              >
                <h3 className="subitem-title">
                  {item.name}
                  <span className="subitem-price">{item.price.toLocaleString()} {layout.currency}</span>
                </h3>
                <p className="subitem-desc">{item.desc}</p>
              </ItemContainer>
            }
          </div>
        </VariationContainer>
      </StyledSubmenuModal>
    </SubmenuModalWrapper>
  ) : null
}
