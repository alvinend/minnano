import styled from "styled-components"
import { color } from 'components/atoms/color'


export const RoundedButton = styled.button`
  padding: 10px 15px;
  border-radius: 30px;
  border: 2px solid ${color.black};
  background-color: ${color.white};
  color: ${color.black};

  &:disabled {
    background-color: ${color.gray};
    color: ${color.white};
    border-color: ${color.white};
  }
`