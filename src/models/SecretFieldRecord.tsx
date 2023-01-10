import uuid from 'uuid';

export type RawSecretFieldRecord = {
  id: string;
  date: Date | null;
  type: 'text' | string;
  label: string;
  content: string;
};
export type SecretFieldRecordCreationParams = {
  id?: string;
  date?: Date | null;
  type?: 'text' | string;
  label?: string;
  content?: string;
};

class SecretFieldRecord {
  id: string;
  date: Date | null;
  type: 'text' | string;
  label: string;
  content: string;
  constructor(initialValues: SecretFieldRecordCreationParams) {
    this.id = initialValues.id || uuid.v4();
    this.date = initialValues.date || null;
    this.type = initialValues.type || 'text';
    this.label = initialValues.label || '';
    this.content = initialValues.content || '';
  }

  getRaw(): RawSecretFieldRecord {
    const { id, date, type, label, content } = this;
    return {
      id,
      date,
      type,
      label,
      content,
    };
  }

  static createFromRaw(rawData: RawSecretFieldRecord) {
    return new SecretFieldRecord(rawData);
  }
}

export default SecretFieldRecord;
