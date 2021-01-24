import styled from "styled-components"
import { color } from 'components/atoms/color'
import { RoundedButton } from "./RoundedButton"


export const RoundedButtonDanger = styled(RoundedButton)`
  border-color: ${color.red};
  color: ${color.red};
`