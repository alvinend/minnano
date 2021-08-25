import React from 'react'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'
import { color } from '../../atoms/color'
import { CartOverlay } from '../../organisms/CartOverlay'
import { SubmenuModal } from 'components/organisms/SubmenuModal'
import { TiShoppingCart } from 'react-icons/ti'
import { GrClose } from 'react-icons/gr'
import { useFirstMountState } from 'react-use'
import { Cart, Item, Category, Layout, Table } from '../../../models/common'
import { FaHistory } from 'react-icons/fa'
import { TableOverlay } from 'components/organisms/TableOverlay'
import Truncate from 'react-truncate'
import { Button } from 'components/atoms/button'

const CategoryWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100vh;
  background-color: ${color.white};
`

const CategoryBar = styled.div`
  display: flex;
  width: 90%;
  padding: 10px 0;
  margin: 20px 0;
  border-radius: 5px;
  background-color: ${color.white};
  overflow-x: auto;
  box-shadow: 2px 2px 4px 2px rgba(0,0,0,0.2);
  border-radius: 15px;
  height: 75px;
`

const CategoryItem = styled.div<{ isSelected: boolean }>`
  min-width: 150px;
  padding: 10px 12px;
  margin: 0 20px;
  text-align: center;
  white-space: nowrap;
  ${({ isSelected }) => isSelected && `border-bottom: 4px ${color.black} solid;`}
  ${({ isSelected }) => isSelected && 'font-weight: bold;'}
`

const CategorySelector = styled.div`
  display: flex;
  align-items: center;
  width: 90%;
  border-radius: 5px;
  position: relative;

  & img {
    width: 50px;
    height: 50px;
    object-fit: cover;
    margin-right: 10px;
    border-radius: 5px;
  }
`

const ItemWrapper = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  width: 90%;
  height: calc(100vh - 192px);
  padding: 0 5px;
  background-color: ${color.secondary};
  border-radius: 35px;
  overflow: auto;
  box-shadow: 2px 2px 4px 2px rgba(0,0,0,0.2);
`
const CategoryDesc = styled.div`
  left: 0;
  top: 50%;
  display: flex;
  align-items: center;
  background-color: ${color.yellow};
  width: 200px;
  height: 80px;
  font-size: 14px;
  padding-left: 10px;
  border-radius: 15px;
  margin-right: 30px;
  box-shadow: 2px 2px 4px 2px rgba(0,0,0,0.2);

  & > div {
    display: flex;
    justify-content: center;
    flex-direction: column;
    line-height: 1.2;

    & > p {
      margin: 0;
    }
  }

  & h1 {
    margin: 0;
    padding: 0;
    font-size: 16px;
    font-weight: 900;
    margin-bottom: 5px;
  }
`

const ItemCard = styled.div<{ index: number }>`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 260px;
  height: 350px;
  margin: 8px;
  padding: 20px;
  border: 2px ${color.gray} solid;
  border-radius: 15px;
  background-color: ${color.white};
  text-align: center;
  animation: slit-in-diagonal-1 0.4s ease-out both;
  animation-delay: ${props => 0.1 * props.index}s;
  color: ${color.black};

  & img {
    height: 200px;
    width: calc(100% + 40px);
    margin: -20px;
    object-fit: cover;
    margin-bottom: 20px;
    border-radius: 15px 15px 0 0;
  }

  & h2 {
    font-size: 18px;
    font-weight: bold;
  }

  & p {
    width: 200px;
    height: 60px;
  }

  & span {
    font-size: 16px;
    font-weight: light;
    line-height: 1.4;
  }

  & .item-price {
    position: absolute;
    bottom: 15px;
  }

  &:hover {
    background-color: ${color.lightGray};
  }

  &:active {
    background-color: ${color.white};
    transform: translateY(4px);
  }

@keyframes slit-in-diagonal-1 {
  0% {
    transform: translateZ(-800px) rotate3d(1, 1, 0, 90deg);
    animation-timing-function: ease-in;
    opacity: 0;
  }
  54% {
    transform: translateZ(-160px) rotate3d(1, 1, 0, 87deg);
    animation-timing-function: ease-in-out;
    opacity: 1;
  }
  100% {
    transform: translateZ(0) rotate3d(1, 1, 0, 0);
    animation-timing-function: ease-out;
  }
}
`

const Icon = styled.div<{ isOpen: boolean, itemCount: number, type: string }>`
  position: fixed;
  display: ${({ isOpen }) => isOpen ? 'flex' : 'none'};
  align-items: center;
  justify-content: center;
  width: 110px;
  height: 110px;
  border-radius: 50%;
  background-color: ${({ isOpen }) => isOpen ? color.red : color.black};
  color: ${color.white};
  font-size: 64px;
	animation: ${({ type }) => type === 'in' ? 'puff-in-center 0.7s cubic-bezier(0.470, 0.000, 0.745, 0.715) both' : type === 'ping' && 'jello-horizontal 0.9s both'};
  z-index: 11;

  &::after {
    content: '${({ itemCount, isOpen }) => !isOpen && itemCount}';
    display: ${({ itemCount, isOpen }) => !isOpen && itemCount ? 'flex' : 'none'};
    position: absolute;
    align-items: center;
    justify-content: center;
    top: 0;
    right: 0;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background-color: ${color.red};
    font-size: 18px;
  }

  @keyframes jello-horizontal {
    0% {
      transform: scale3d(1, 1, 1);
    }
    30% {
      transform: scale3d(1.25, 0.75, 1);
    }
    40% {
      transform: scale3d(0.75, 1.25, 1);
    }
    50% {
      transform: scale3d(1.15, 0.85, 1);
    }
    65% {
      transform: scale3d(0.95, 1.05, 1);
    }
    75% {
      transform: scale3d(1.05, 0.95, 1);
    }
    100% {
      transform: scale3d(1, 1, 1);
    }
  }


  @keyframes puff-in-center {
    0% {
      transform: scale(2);
      filter: blur(4px);
      box-shadow: 10px 10px 10px 0px rgba(0,0,0,0);

      opacity: 0;
    }
    100% {
      transform: scale(1);
      filter: blur(0px);
      box-shadow: 5px 5px 5px 0px rgba(0,0,0,0.4);
      opacity: 1;
    }
  }
`

const CartIcon = styled(Icon)`
  right: 3%;
  bottom: 3%;
`

const ButtonContainer = styled.div<{ isOpen: boolean, itemCount: number, type: string }>`
  position: relative;
  display: flex;
  justify-content: flex-end;
  width: 90%;
  margin-top: 20px;

  &::after {
    content: '${({ itemCount, isOpen }) => !isOpen && itemCount}';
    display: ${({ itemCount, isOpen }) => !isOpen && itemCount ? 'flex' : 'none'};
    position: absolute;
    align-items: center;
    justify-content: center;
    color: ${color.white};
    top: -20px;
    right: 0;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: ${color.red};
    font-size: 18px;
    animation: ${({ type }) => type === 'in' ? 'puff-in-center 0.7s cubic-bezier(0.470, 0.000, 0.745, 0.715) both' : type === 'ping' && 'jello-horizontal 0.9s both'};
  }

  & > button:not(:last-child) {
    margin-right: 30px;
  }
`

type iCatalogPage = {
  categories: Category[]
  items: Item[]
  cart: Cart
  setCart: React.Dispatch<any>
  totalPrice: number
  layout: Layout
  onSendOrder: (number: string) => void
  table: Table | undefined
  onSetTableStatus: (status: string) => void
}

const CatalogPage: React.FC<iCatalogPage> = ({
  categories,
  items,
  cart,
  setCart,
  totalPrice,
  layout,
  onSendOrder,
  table,
  onSetTableStatus
}) => {
  const [selectedCategory, setSelectedCategory] = React.useState(categories[0])
  const [selectedItems, setSetSelectedItems] = React.useState<Item[]>([])
  const [isCartShowing, setIsCartShowing] = React.useState(false)
  const [isTableShowing, setIsTableShowing] = React.useState(false)

  const [subitemShowing, setSubitemShowing] = React.useState({} as Item)
  const [cartAnimationType, setCartAnimationType] = React.useState('in')
  const [cartIconAnimationType, setCartIconAnimationType] = React.useState('in')
  const isFirstMount = useFirstMountState()
  const history = useHistory()

  const handleCategoryClick = React.useCallback(
    category => {
      setSelectedCategory(category)
    },
    []
  )

  const handleItemClick = React.useCallback(
    item => {
      setSubitemShowing(item)
    },
    []
  )

  const handleSubitemCancel = React.useCallback(
    () => {
      setSubitemShowing({} as Item)
    },
    []
  )

  const handleAddCart = React.useCallback(
    (addCart: Cart) => {
      let newCart = cart
      const checkCart = newCart.map(cartItem => cartItem.item._id)

      addCart.forEach(
        ({ item, quantity }) => {
          const index = checkCart.indexOf(item._id)

          if (index === -1) {
            newCart.push({
              item,
              quantity
            })
          } else {
            newCart[index].quantity += quantity
          }
        }
      )

      setCart([...newCart])
      setSubitemShowing({} as Item)
    },
    [cart, setCart]
  )

  React.useEffect(
    () => {
      const selectedItems = items.filter(item => item.categoryid === selectedCategory._id)
      setSetSelectedItems(selectedItems)
    },
    [selectedCategory, items]
  )

  const handleShowCart = React.useCallback(
    () => {
      setCartAnimationType('in')
      setIsCartShowing(true)
    },
    []
  )

  const handleShowTable = React.useCallback(
    () => {
      setCartAnimationType('in')
      setIsTableShowing(true)
    },
    []
  )

  const handleHideOverlay = React.useCallback(
    () => {
      setCartAnimationType('out')
      setTimeout(() => {
        setIsCartShowing(false)
        setIsTableShowing(false)
      }, 500)
    },
    []
  )

  const handleConfirmed = React.useCallback(
    async () => {
      if (table) {
        setTimeout(() => {
          onSendOrder(table.label)
        }, 500)
      } else {
        setCartAnimationType('out')
        setTimeout(() => {
          history.push('/customer/number')
        }, 500)
      }
    },
    [history, table, onSendOrder]
  )

  const itemCount = React.useMemo(
    () => cart.reduce((a, b) => a + b.quantity, 0),
    [cart]
  )

  const isOverlayShowing = React.useMemo(
    () => (isTableShowing || isCartShowing),
    [isTableShowing, isCartShowing]
  )

  const handleFinishTable = React.useCallback(
    async () => {
      await onSetTableStatus('pending')
      history.push('/customer/pending')
    },
    [onSetTableStatus, history]
  )

  React.useEffect(
    () => {
      if (!isFirstMount) {
        setCartIconAnimationType('ping')
      }
    },
    [itemCount, isFirstMount]
  )

  return (
    <CategoryWrapper>
      <CartIcon
        onClick={isOverlayShowing ? handleHideOverlay : handleShowCart}
        isOpen={isOverlayShowing}
        itemCount={itemCount}
        type={cartIconAnimationType}
        onAnimationEnd={() => setCartIconAnimationType('')}
      >
        <GrClose />
      </CartIcon>

      {isCartShowing && <CartOverlay
        cart={cart}
        setCart={setCart}
        totalPrice={totalPrice}
        onClickBack={handleHideOverlay}
        animationType={cartAnimationType}
        onClickConfirmed={handleConfirmed}
        layout={layout}
      />}

      {isTableShowing &&
        <TableOverlay
          layout={layout}
          table={table!}
          animationType={cartAnimationType}
          onCancel={handleHideOverlay}
          onFinish={handleFinishTable}
        />
      }


      <CategorySelector>
        <CategoryDesc>
          <img src={`${selectedCategory.imagelink}`} alt="Category" />
          <div>
            <h1>{selectedCategory.name}</h1>
            <p>{selectedCategory.desc}</p>
          </div>
        </CategoryDesc>
        <CategoryBar>
          {categories.map(category => (
            <CategoryItem
              key={category._id}
              onClick={() => handleCategoryClick(category)}
              isSelected={selectedCategory._id === category._id}
            >
              {category.name}
            </CategoryItem>
          ))}
        </CategoryBar>
      </CategorySelector>

      <ItemWrapper>
        {
          selectedItems.map(
            (item, index) => (
              <ItemCard
                key={item._id}
                onClick={() => handleItemClick(item)}
                index={index}
              >
                <img src={`${item.imagelink}`} alt="Item" />
                <h2>{item.name}</h2>
                <Truncate
                  children={item.desc}
                  lines={2}
                  ellipsis='...'
                  width={200}
                />
                <span className="item-price">
                  <b>{item.price.toLocaleString()} {layout?.currency}</b>
                </span>
              </ItemCard>
            )
          )
        }
      </ItemWrapper>

      <ButtonContainer itemCount={itemCount} isOpen={isOverlayShowing} type={cartIconAnimationType}>
        <Button size="small" width="180px" onClick={handleShowTable}> History </Button>
        <Button
          size="small"
          width="180px"
          backgroundColor={color.blue}
          color={color.white}
          onClick={handleShowCart}
          onAnimationEnd={() => setCartIconAnimationType('')}
        >
          Cart
        </Button>
      </ButtonContainer>

      <SubmenuModal
        isShowing={!!subitemShowing?._id}
        onSubmit={handleAddCart}
        onCancel={handleSubitemCancel}
        item={subitemShowing}
        layout={layout}
      />

    </CategoryWrapper>
  )
}

export { CatalogPage }
