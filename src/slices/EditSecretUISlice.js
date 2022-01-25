import { createSlice } from '@reduxjs/toolkit';

import { showSecretSuccess } from 'slices/ShowSecretUISlice';
import { hideModal } from 'slices/ShowSecretUISlice';

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
    changeField: (state, action) => {
      const { field, value } = action.payload;
      state.isEditing = true;
      const fieldIndex = state.data.fields.findIndex(
        fieldToUpdate => fieldToUpdate.id === field.id
      );
      state.data.fields[fieldIndex].content = value;
    },
  },
  extraReducers: {
    [showSecretSuccess]: (state, action) => {
      state.isEditing = false;
      state.data = action.payload.secret.data;
    },
    [hideModal]: state => {
      state.isEditing = false;
      state.data = null;
    },
  },
});

// Action creators are generated for each case reducer function
export const { updateData, changeField } = EditSecretUISlice.actions;

export default EditSecretUISlice.reducer;
