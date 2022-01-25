import { createSlice } from '@reduxjs/toolkit';
import SecretDataRecord from 'models/SecretDataRecord';

import { createSecretSuccess } from 'slices/AppUISlice';

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
      state.title = `Untitled ${isFolder ? 'folder' : 'secret'}`;
      state.folder = folder;
      state.isFolder = isFolder;
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
    [createSecretSuccess]: () => getInitialState(),
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
