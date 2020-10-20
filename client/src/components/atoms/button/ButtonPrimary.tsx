import { Button } from 'components/atoms/button/Button'
import { color } from 'components/atoms/color'
import styled from 'styled-components'

export const ButtonPrimary = styled(Button)`
  background-color: ${color.green};
  border: 0;
  color: ${color.white};

  &:hover {
    border: 0;
  }
`
