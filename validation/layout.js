const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateLayoutInput(data) {
  let errors = {}

  data.storename = !isEmpty(data.storename) ? data.storename : '';

  if (Validator.isEmpty(data.storename)) {
    errors.storename = 'Store Name field is required';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  }
};
