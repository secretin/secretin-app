import SecretFieldRecord from 'models/SecretFieldRecord';

class SecretDataRecord {
  constructor(raw) {
    this.type = raw.type || 'default';
    this.fields = raw.fields || [];
  }

  addNewField(params = {}) {
    this.fields.push(new SecretFieldRecord(params));
    return this.fields;
  }

  static createWithDefaultFields(defaultFields) {
    return defaultFields.reduce(
      (record, field) => record.addNewField(field),
      new SecretDataRecord()
    );
  }

  static createFromRaw(rawData) {
    const raw = Object.entries(rawData).reduce((output, [key, value]) => {
      switch (key) {
        case 'fields':
          return {
            ...output,
            fields: value.map(field => SecretFieldRecord.createFromRaw(field)),
          };
        default:
          return output;
      }
    }, rawData);
    return new SecretDataRecord(raw);
  }
}

SecretDataRecord.DEFAULT_FIELDS = [
  { label: 'login', type: 'text' },
  { label: 'password', type: 'password' },
  { label: 'url', type: 'url' },
];

export default SecretDataRecord;
