import { createSlice } from '@reduxjs/toolkit';

import { showSecretSuccess } from 'slices/ShowSecretUISlice';

export const EditSecretUISlice = createSlice({
  name: 'EditSecretUI',
  initialState: {
    isEditing: false,
    data: null,
  },
  reducers: {
    updateData: (state, action) => {
      state.isEditing = false;
      state.data = action.payload.data;
    },
    hideModal: (state, action) => {
      state.isEditing = false;
      state.data = null;
    },
    changeField: (state, action) => {
      const { field, value } = action.payload;
      state.isEditing = true;
      // TODO : this is probably broken, check actual structure of the metadata
      const fieldIndex = state.data.fields.findIndex(
        fieldToUpdate => fieldToUpdate.id === field.id
      );
      state.data.fields[fieldIndex] = value;
    },
  },
  extraReducers: {
    [showSecretSuccess]: (state, action) => {
      state.isEditing = false;
      state.data = action.payload.secret.data;
    },
  },
});

// Action creators are generated for each case reducer function
export const { updateData, hideModal, changeField } = EditSecretUISlice.actions;

export default EditSecretUISlice.reducer;
