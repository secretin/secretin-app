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
  special: new Immutable.Map(),
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
        special: new Immutable.Map(),
      })
    );
  }

  onDetectTypeSuccess({ file, importType, special }) {
    this.setState(
      this.state.merge({
        importType,
        error: '',
        file,
        special: new Immutable.Map(special),
      })
    );
  }

  onImportProgress({ importStatus, importTotal }) {
    this.setState(
      this.state.merge({
        importStatus,
        importTotal,
        error: '',
      })
    );
  }

  onImportSuccess() {
    this.setState(
      this.state.merge({
        importing: false,
        success: true,
        importType: '',
        error: '',
        importStatus: 0,
        importTotal: 0,
        special: new Immutable.Map(),
      })
    );
  }

  onImportFailure({ error }) {
    this.setState(
      this.state.merge({
        importing: false,
        success: false,
        importType: '',
        error: error,
        special: new Immutable.Map(),
      })
    );
  }

  onDefaultStore() {
    this.setState(new ImportState());
  }

  onChangeSpecial({ name, value }) {
    this.setState(this.state.setIn(['special', name], value));
  }
}

export default alt.createStore(makeImmutable(ImportStore), 'ImportStore');
