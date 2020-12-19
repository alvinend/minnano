import Validator from 'validator'
import { isEmpty } from 'validation/isEmpty'
import { ISetting } from 'models/Setting'

type ISettingError = {
  storename: string
}

export const validateLayoutInput = (data:ISetting["layout"]) => {
  const errors = {} as ISettingError

  data.storename = !isEmpty(data.storename) ? data.storename : '';

  if (Validator.isEmpty(data.storename)) {
    errors.storename = 'Store Name field is required';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  }
}
