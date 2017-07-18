import { findKey } from 'lodash';

import alt from 'utils/alt';
import importers from 'utils/importers';

class ImportActions {
  constructor() {
    this.generateActions(
      'importSecretsProgress',
      'importSecretsSuccess',
      'importSecretsFailure',
      'detectTypeSuccess',
      'detectTypeFailure',
      'defaultStore',
      'changeMandatoryField'
    );
  }

  detectType({ file }) {
    const reader = new FileReader();
    reader.readAsText(file);
    reader.onload = ({ target }) => {
      const file = target.result;
      const importType = findKey(importers, importer => importer.detect(file));

      if (typeof importType !== 'undefined') {
        const mandatoryFields = importers[importType].mandatoryFields;
        this.detectTypeSuccess({ file, importType, mandatoryFields });
      } else {
        this.detectTypeFailure({ error: 'Invalid type' });
      }
    };
    return reader;
  }

  importSecrets({ file, type, mandatoryFields }) {
    return dispatch => {
      dispatch();
      importers[type]
        .parse(
          file,
          mandatoryFields.toJS(),
          ({ state: importStatus, total: importTotal }) =>
            this.importSecretsProgress({
              importStatus,
              importTotal,
            })
        )
        .then(() => {
          this.importSecretsSuccess();
        })
        .catch(error => {
          this.importSecretsFailure({ error });
        });
    };
  }
}

export default alt.createActions(ImportActions);
