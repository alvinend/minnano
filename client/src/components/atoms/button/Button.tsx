import styled from 'styled-components'
import { color } from '../color'

export const Button = styled.button<{
  backgroundColor?: string,
  color?: string
  size?: 'large' | 'small'
}>`
  padding: 10px 20px;
  font-size: 20px;
  font-weight: 700;
  background: ${({ backgroundColor }) => backgroundColor ? backgroundColor : '#eee'};
  border-radius: 15px;
  box-shadow: 1px 1px 2px 1px rgba(0,0,0,0.4);
  transition: all 0.2s ease-in-out;
  color: ${props => props.color ? props.color : color.black};
  border: 0px solid transparent;
  height: ${({ size }) => size === 'large' ? '65px' : size === 'small' ? '55px' : '60px'};

  &:hover {
    border: 0px solid transparent;
    box-shadow: 1px 1px 2px 1px rgba(0,0,0,0.4);
    transform: scaleY(1.05)
  }
`
