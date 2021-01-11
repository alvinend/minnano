import Validator from 'validator'
import { isEmpty } from 'validation/isEmpty'

import { Category } from 'models/Category'
import { IItem } from 'models/Item';

type IItemError = {
  name: string
  categoryid: string
  price: string
  subitemids: string
}

export const validateItemInput = async (data: IItem) => {
  const errors = {} as IItemError

  data.name = !isEmpty(data.name) ? data.name : '';
  data.categoryid = !isEmpty(data.categoryid) ? data.categoryid : '';

  if (Validator.isEmpty(data.name)) {
    errors.name = 'Name field is required';
  }

  if (!data.price) {
    errors.price = 'Price field is required'
  }

  try {
    if (!(await Category.findOne({ _id: data.categoryid }))) {
      errors.categoryid = 'Category Id is not valid'
    }
  } catch {
    errors.categoryid = 'Category Id is not valid'
  }

  return {
    errors,
    isValid: isEmpty(errors)
  }
}
