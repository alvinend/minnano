import React from 'react'
import styled from 'styled-components'

const InputContainer  = styled.div`
  margin-bottom: 1.5rem;
  position: relative;
  width: 20.4375rem;
`

const InputLabel = styled.span`
  position: absolute;
	top: 20px;
	left: 16px;
	color: rgba(19, 19, 21, 0.6);
  transition: top .2s;
`

const HelperText = styled.span`
  font-size: 12px;
	color: rgba(19, 19, 21, 0.6);
	margin: 4px 14px;
`

const StyledInput = styled.input<{ isDanger: boolean, isValued: boolean }>`
  border: none;
	border-bottom: 0.125rem solid ${({ isDanger }) => isDanger ? '#b50706' : 'rgba(19, 19, 21, 0.6)'};
	width: 100%;
	height: 2rem;
	font-size: 16px;
	padding-left: 0.875rem;
	line-height: 1.6;
	padding-top: 24px;
  padding-bottom: 12px;
  background: inherit;

  ${({ isValued }) => isValued && `
    & + ${InputLabel} {
      top: 0;
      font-size: 12px;
    }
  `}

${({ isDanger }) => isDanger && `
    & + ${InputLabel} {
      color: #b50706;
    }

    & ~ ${HelperText} {
      color: #b50706;
    }
  `}
  
  &:focus {
    outline: none;
    border-color: ${({ isDanger }) => isDanger ? '#b50706' : '#1e4bd1'};

    & + ${InputLabel} {
      top: 0;
      font-size: 12px;
      color: ${({ isDanger }) => isDanger ? '#b50706' : '#1e4bd1'};
    }

    & ~ ${HelperText} {
      ${({ isDanger }) => isDanger && 'color: #b50706;'}
    }
  }

  &:hover {
    background: rgba(73, 133, 224, 0.12);
	  border-color: #121212;
  }

  &:disabled {
    background: #eff1f2;
    cursor: not-allowed;
    
    & + ${InputLabel} {
      color: rgba(60, 60, 67, 0.3);
    }

    & ~ ${HelperText} {
      color: rgba(60, 60, 67, 0.3);
    }
  }
`

type iInput = {
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  isDanger?: boolean
  label?: string
  helperText?: string
  type?: string
}

export const Input: React.FC<iInput> = ({
  value,
  onChange,
  isDanger,
  label,
  helperText,
  type
}) => {
  return (
    <InputContainer>
      <label>
        <StyledInput
          isDanger={!!isDanger}
          isValued={!!value}
          onChange={onChange}
          value={value}
          type={type}
        />
        <InputLabel>{label}</InputLabel>
        <HelperText>{helperText}</HelperText>
      </label>
    </InputContainer>
  )
}
