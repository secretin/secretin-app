import SecretFieldRecord from 'models/SecretFieldRecord';
import {
  RawSecretFieldRecord,
  SecretFieldRecordCreationParams,
} from './SecretFieldRecord';

export type RawSecretDataRecord = {
  type: string;
  fields: RawSecretFieldRecord[];
};
export type SecretDataRecordCreationParams = {
  type?: string;
  fields?: SecretFieldRecord[];
};

class SecretDataRecord {
  static DEFAULT_FIELDS = [
    { label: 'login', type: 'text' },
    { label: 'password', type: 'password' },
    { label: 'url', type: 'url' },
  ];
  type: string;
  fields: SecretFieldRecord[];
  constructor(initialValues: SecretDataRecordCreationParams) {
    this.type = initialValues.type || 'default';
    this.fields = initialValues.fields || [];
  }

  addNewField(params: SecretFieldRecordCreationParams) {
    this.fields.push(new SecretFieldRecord(params));
    return this;
  }

  getRaw() {
    const { type, fields } = this;
    return {
      type,
      fields,
    };
  }

  static createWithDefaultFields() {
    return SecretDataRecord.DEFAULT_FIELDS.reduce((record, field) => {
      return record.addNewField(field);
    }, new SecretDataRecord({}));
  }

  static createFromRaw(rawData: RawSecretDataRecord) {
    const initialValues = {
      ...rawData,
      fields: rawData.fields.map(field =>
        SecretFieldRecord.createFromRaw(field)
      ),
    };
    return new SecretDataRecord(initialValues);
  }
}

export default SecretDataRecord;
