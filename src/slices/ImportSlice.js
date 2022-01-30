import { createSlice } from '@reduxjs/toolkit';
import importers from 'utils/importers';
import { findKey } from 'lodash';

const getInitialState = () => ({
  importType: '',
  importing: false,
  importStatus: 0,
  importTotal: 0,
  success: false,
  file: '',
  error: '',
  mandatoryFields: {},
});

export const ImportSlice = createSlice({
  name: 'Import',
  initialState: getInitialState(),
  reducers: {
    showModal: (state, action) => {
      const { secret, tab } = action.payload;
      this.state.secret = secret;
      this.state.tab = tab || 'details';
      this.state.errors = {};
    },
    _importSecrets: (state, action) => {
      state.importing = true;
      state.success = false;
      state.error = '';
    },

    detectTypeFailure: (state, action) => {
      const { error } = action.payload;
      state.error = error;
      state.importType = '';
      state.mandatoryFields = {};
    },

    detectTypeSuccess: (state, action) => {
      const { file, importType, mandatoryFields } = action.payload;
      state.importType = importType;
      state.error = '';
      state.file = file;
      state.mandatoryFields = mandatoryFields;
    },

    importSecretsProgress: (state, action) => {
      const { importStatus, importTotal } = action.payload;
      state.error = '';
      state.importStatus = importStatus;
      state.importTotal = importTotal;
    },

    importSecretsSuccess: (state, action) => {
      state.importing = false;
      state.success = true;
      state.importType = '';
      state.error = '';
      state.importStatus = 0;
      state.importTotal = 0;
      state.mandatoryFields = {};
    },

    importSecretsFailure: (state, action) => {
      const { error } = action.payload;

      state.importing = false;
      state.success = false;
      state.importType = '';
      state.error = error;
      state.mandatoryFields = {};
    },

    defaultStore: (state, action) => {
      state = getInitialState();
    },

    changeMandatoryField: (state, action) => {
      const { field, value } = action.payload;
      state.mandatoryFields[field.name].value = value;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  showModal,
  _importSecrets,
  detectTypeFailure,
  detectTypeSuccess,
  importSecretsProgress,
  importSecretsSuccess,
  importSecretsFailure,
  defaultStore,
  changeMandatoryField,
} = ImportSlice.actions;

export const detectType = ({ file }) => (dispatch, getState) => {
  const reader = new FileReader();
  reader.readAsText(file);
  reader.onload = ({ target }) => {
    const file = target.result;
    const importType = findKey(importers, importer => importer.detect(file));

    if (typeof importType !== 'undefined') {
      const mandatoryFields = importers[importType].mandatoryFields;
      dispatch(detectTypeSuccess({ file, importType, mandatoryFields }));
    } else {
      dispatch(detectTypeFailure({ error: 'Invalid type' }));
    }
  };
  return reader;
};

export const importSecrets = ({ file, type, mandatoryFields }) => (
  dispatch,
  getState
) => {
  dispatch(_importSecrets());
  importers[type]
    .parse(
      file,
      mandatoryFields,
      ({ state: importStatus, total: importTotal }) =>
        dispatch(
          importSecretsProgress({
            importStatus,
            importTotal,
          })
        )
    )
    .then(() => {
      dispatch(importSecretsSuccess());
    })
    .catch(error => {
      dispatch(importSecretsFailure({ error }));
    });
};

export default ImportSlice.reducer;
