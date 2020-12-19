import Validator from 'validator'
import { isEmpty } from 'validation/isEmpty'
import { ICategory } from 'models/Category';

export const validateCategoryInput = (data:ICategory) => {
  const errors = {} as ICategory

  data.name = !isEmpty(data.name) ? data.name : '';

  if (Validator.isEmpty(data.name)) {
    errors.name = 'Name field is required';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  }
}
