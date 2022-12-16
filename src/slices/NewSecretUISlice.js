import { createSlice } from '@reduxjs/toolkit';
import SecretDataRecord from 'models/SecretDataRecord';
import { createIntl, createIntlCache } from 'react-intl';

import { createSecretSuccess, disconnectUserSuccess } from 'slices/AppUISlice';
import secretin from 'utils/secretin';
import { Utils } from 'secretin';
import { getLocale } from '../i18n/helpers';
import { getStrings } from '../i18n/strings';

const cache = createIntlCache();

const intl = createIntl(
  {
    locale: getLocale(),
    messages: getStrings(getLocale()),
  },
  cache
);

const getInitialState = () => ({
  shown: false,
  folder: null,
  isFolder: false,
  title: '',
  data: SecretDataRecord.createWithDefaultFields(
    SecretDataRecord.DEFAULT_FIELDS
  ).getRaw(),
});

export const NewSecretUISlice = createSlice({
  name: 'NewSecretUI',
  initialState: getInitialState(),
  reducers: {
    showModal: (state, action) => {
      const { folder, isFolder } = action.payload;
      state.shown = true;
      state.title = intl.formatMessage({
        id: `Untitled ${isFolder ? 'folder' : 'secret'}`,
      });
      state.folder = folder;
      state.isFolder = isFolder;
      const loginIndex = state.data.fields.findIndex(
        fieldToUpdate => fieldToUpdate.label === 'login'
      );
      const passwordIndex = state.data.fields.findIndex(
        fieldToUpdate => fieldToUpdate.label === 'password'
      );
      state.data.fields[loginIndex].content =
        secretin.currentUser.options?.defaultUsername ?? '';
      state.data.fields[
        passwordIndex
      ].content = Utils.PasswordGenerator.generatePassword();
    },
    hideModal: () => getInitialState(),
    changeTitle: (state, action) => {
      const { value } = action.payload;
      state.title = value;
    },
    changeField: (state, action) => {
      const { field, value } = action.payload;
      const fieldIndex = state.data.fields.findIndex(
        fieldToUpdate => fieldToUpdate.id === field.id
      );
      state.data.fields[fieldIndex].content = value;
    },
  },
  extraReducers: {
    [createSecretSuccess]: getInitialState,
    [disconnectUserSuccess]: getInitialState,
  },
});

// Action creators are generated for each case reducer function
export const {
  showModal,
  hideModal,
  changeTitle,
  changeField,
} = NewSecretUISlice.actions;

export default NewSecretUISlice.reducer;
