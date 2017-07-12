import alt from 'utils/alt';
import Import from 'utils/import';

class ImportActions {
  constructor() {
    this.generateActions(
      'importProgress',
      'importSuccess',
      'importFailure',
      'detectTypeSuccess',
      'detectTypeFailure',
      'defaultStore',
      'changeSpecial'
    );
  }

  detectType({ file }) {
    const reader = new FileReader();
    reader.readAsText(file);
    reader.onload = readedFile => {
      const file = readedFile.target.result;
      let importType = '';
      const importTypes = Object.keys(Import);
      for (let i = 0; i < importTypes.length; i++) {
        if (Import[importTypes[i]].detect(file)) {
          importType = importTypes[i];
          break;
        }
      }
      if (importType !== '') {
        const special = Import[importType].needSpecial();
        this.detectTypeSuccess({ file, importType, special });
      } else {
        this.detectTypeFailure({ error: 'Invalid type' });
      }
    };
    return reader;
  }

  importSecrets({ file, type, special }) {
    return dispatch => {
      dispatch();
      Import[type]
        .parse(file, special.toJS(), status =>
          this.importProgress({
            importStatus: status.state,
            importTotal: status.total,
          })
        )
        .then(() => {
          this.importSuccess();
        })
        .catch(error => {
          this.importFailure({ error });
        });
    };
  }
}

export default alt.createActions(ImportActions);
