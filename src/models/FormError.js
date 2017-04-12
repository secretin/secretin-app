import Immutable from 'immutable';

const defaultRecord = {
  field: '',
  message: '',
};

class FormError extends (new Immutable.Record(defaultRecord)) {}

export default FormError;
