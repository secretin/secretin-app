import Immutable from 'immutable';

import SecretFieldRecord from 'models/SecretFieldRecord';

const defaultRecord = {
  type: 'default',
  fields: new Immutable.List(),
};

class SecretDataRecord extends new Immutable.Record(defaultRecord) {

  addNewField(params = new Immutable.Map()) {
    return this.update('fields', fields =>
      fields.push(new SecretFieldRecord(params))
    );
  }

  static createWithDefaultFields(defaultFieds) {
    return defaultFieds.reduce(
      (record, field) => record.addNewField(field),
      new SecretDataRecord()
    );
  }

  static createFromRaw(rawData) {
    const raw = Immutable.fromJS(rawData)
      .map((value, key) => {
        switch (key) {
          case 'fields':
            return value.map(
              field => SecretFieldRecord.createFromRaw(field)
            ).toList();
          default:
            return value;
        }
      });
    return new SecretDataRecord(raw);
  }
}

SecretDataRecord.DEFAULT_FIELDS = new Immutable.List([
  new Immutable.Map({ label: 'login', type: 'text' }),
  new Immutable.Map({ label: 'password', type: 'password' }),
]);

export default SecretDataRecord;
