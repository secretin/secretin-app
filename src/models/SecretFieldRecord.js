import uuid from 'uuid';

class SecretFieldRecord {
  constructor(raw) {
    this.id = raw.id || uuid.v4();
    this.date = raw.date || null;
    this.type = raw.type || 'text';
    this.label = raw.label || '';
    this.content = raw.content || '';
  }

  static createFromRaw(rawData) {
    const raw = {
      ...rawData,
      content: rawData.value,
    };
    if (raw.value) delete raw.value;
    return new SecretFieldRecord(raw);
  }
}

export default SecretFieldRecord;
