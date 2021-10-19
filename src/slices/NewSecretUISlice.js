import { createSlice } from '@reduxjs/toolkit';

import SecretDataRecord from 'models/SecretDataRecord';

const getInitialState = () => ({
  shown: false,
  folder: null,
  isFolder: false,
  title: '',
  data: SecretDataRecord.createWithDefaultFields(
    SecretDataRecord.DEFAULT_FIELDS
  ),
});

export const NewSecretUISlice = createSlice({
  name: 'NewSecretUI',
  initialState: getInitialState(),
  reducers: {
    updateSecretUserRightsSuccess: (state, action) => {
      const { secret, user, rights } = action.payload;
      state.metadata[secret.id].users.map(userToUpdate => {
        if (userToUpdate.id === user.id) {
          return userToUpdate.set('rights', rights);
        }
        return userToUpdate;
      });
    },
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
});

// Action creators are generated for each case reducer function
export const {
  updateSecretUserRightsSuccess,
  showModal,
  hideModal,
  changeTitle,
  changeField,
} = NewSecretUISlice.actions;

export default NewSecretUISlice.reducer;
