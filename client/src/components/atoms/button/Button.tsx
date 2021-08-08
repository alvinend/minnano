import styled from 'styled-components'

export const Button = styled.button`
  padding: 10px 20px;
  font-size: 18px;
  background: #eee;
  border: 2px solid #aaa;
  border-radius: 4px;
  box-shadow: 1px 1px 2px 1px rgba(0,0,0,0.2);
  transition: all 0.2s ease-in-out;

  &:hover {
    border: 2px solid #555;
    box-shadow: 1px 1px 2px 1px rgba(0,0,0,0.2);
    transform: scaleY(1.05)
  }
`
