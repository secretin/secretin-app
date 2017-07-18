import Immutable, { Record } from 'immutable';
import alt from 'utils/alt';
import makeImmutable from 'utils/makeImmutable';

import ImportActions from 'actions/ImportActions';

const ImportState = new Record({
  importType: '',
  importing: false,
  importStatus: 0,
  importTotal: 0,
  success: false,
  file: '',
  error: '',
  mandatoryFields: new Immutable.Map(),
});

class ImportStore {
  constructor() {
    this.bindActions(ImportActions);
    this.state = new ImportState();
  }

  onImportSecrets() {
    this.setState(
      this.state.merge({
        importing: true,
        success: false,
        error: '',
      })
    );
  }

  onDetectTypeFailure({ error }) {
    this.setState(
      this.state.merge({
        error,
        importType: '',
        mandatoryFields: new Immutable.Map(),
      })
    );
  }

  onDetectTypeSuccess({ file, importType, mandatoryFields }) {
    this.setState(
      this.state.merge({
        importType,
        error: '',
        file,
        mandatoryFields: Immutable.fromJS(mandatoryFields),
      })
    );
  }

  onImportSecretsProgress({ importStatus, importTotal }) {
    this.setState(
      this.state.merge({
        importStatus,
        importTotal,
        error: '',
      })
    );
  }

  onImportSecretsSuccess() {
    this.setState(
      this.state.merge({
        importing: false,
        success: true,
        importType: '',
        error: '',
        importStatus: 0,
        importTotal: 0,
        mandatoryFields: new Immutable.Map(),
      })
    );
  }

  onImportSecretsFailure({ error }) {
    this.setState(
      this.state.merge({
        importing: false,
        success: false,
        importType: '',
        error: error,
        mandatoryFields: new Immutable.Map(),
      })
    );
  }

  onDefaultStore() {
    this.setState(new ImportState());
  }

  onChangeMandatoryField({ field, value }) {
    this.setState(
      this.state.setIn(['mandatoryFields', field.get('name'), 'value'], value)
    );
  }
}

export default alt.createStore(makeImmutable(ImportStore), 'ImportStore');
