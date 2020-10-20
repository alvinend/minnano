import styled from 'styled-components'

export const Button = styled.button`
  padding: 10px 20px;
  font-size: 18px;
  background: #eee;
  border: 2px solid #aaa;
  border-radius: 4px;
  box-shadow: 5px 5px 10px 5px rgba(0,0,0,0.2);
  transition: all 0.2s ease-in-out;

  &:hover {
    border: 2px solid #555;
    box-shadow: 6px 6px 10px 6px rgba(0,0,0,0.3);
    transform: scale(1.1)
  }
`
