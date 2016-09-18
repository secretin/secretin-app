import Immutable from 'immutable';
import uuid from 'uuid';

const defaultRecord = {
  id: null,
  type: 'text',
  label: '',
  content: '',
};

class SecretFieldRecord extends new Immutable.Record(defaultRecord) {
  constructor(attributes = new Immutable.Map()) {
    super(
      attributes.set(
        'id',
        attributes.get('id', uuid.v4())
      )
    );
  }

  static createFromRaw(rawData) {
    return new SecretFieldRecord(
      Immutable.fromJS(rawData)
    );
  }
}

export default SecretFieldRecord;
