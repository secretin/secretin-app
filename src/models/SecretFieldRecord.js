import Immutable from 'immutable';
import uuid from 'uuid';

const defaultRecord = {
  id: null,
  date: null,
  type: 'text',
  label: '',
  content: '',
};

class SecretFieldRecord extends (new Immutable.Record(defaultRecord)) {
  constructor(attributes = new Immutable.Map()) {
    super(attributes.set('id', attributes.get('id', uuid.v4())));
  }

  static createFromRaw(rawData) {
    const raw = Immutable.fromJS(rawData).mapKeys(key => {
      switch (key) {
        case 'value':
          return 'content';
        default:
          return key;
      }
    });
    return new SecretFieldRecord(raw);
  }
}

export default SecretFieldRecord;
