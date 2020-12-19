import Validator from 'validator'
import { isEmpty } from 'validation/isEmpty'
import { IUser } from 'models/User'

type IUserError = {
  email: string
  password: string
}

export const validateLoginInput = (data:IUser) => {
  const errors = {} as IUserError

  data.email = !isEmpty(data.email) ? data.email : ''
  data.password = !isEmpty(data.password) ? data.password : ''

  if (!Validator.isEmail(data.email)) {
    errors.email = 'Email is invalid'
  }

  if (Validator.isEmpty(data.email)) {
    errors.email = 'Email field is required'
  }

  if (Validator.isEmpty(data.password)) {
    errors.password = 'Password field is required'
  }

  return {
    errors,
    isValid: isEmpty(errors)
  }
}
