import Validator from 'validator'
import { isEmpty } from 'validation/isEmpty'
import { IUser } from 'models/User'

type INewUser = IUser & {
  password2: string
}

type INewUserError = {
  email: string
  password: string
  password2: string
}

export const validateRegisterInput = (data:INewUser) => {
  const errors = {} as INewUserError

  data.email = !isEmpty(data.email) ? data.email : ''
  data.password = !isEmpty(data.password) ? data.password : ''
  data.password2 = !isEmpty(data.password2) ? data.password2 : ''
  data.role = !isEmpty(data.role) ? data.role : ''

  if (Validator.isEmpty(data.email)) {
    errors.email = 'Email field is required'
  }

  if (!Validator.isEmail(data.email)) {
    errors.email = 'Email is invalid'
  }

  if (Validator.isEmpty(data.password)) {
    errors.password = 'Password field is required'
  }

  if (Validator.isEmpty(data.password2)) {
    errors.password2 = 'Confirm Password field is required'
  }

  if (!Validator.equals(data.password, data.password2)) {
    errors.password2 = 'Passwords must match'
  }

  if (Validator.isEmpty(data.role)) {
    errors.email = 'Role field is required'
  }

  return {
    errors,
    isValid: isEmpty(errors)
  }
}
