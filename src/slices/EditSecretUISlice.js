import { createSlice } from '@reduxjs/toolkit';

import { showSecretSuccess } from 'slices/ShowSecretUISlice';
import { hideModal } from 'slices/ShowSecretUISlice';
import { updateSecretSuccess } from 'slices/MetadataSlice';
import { disconnectUserSuccess } from 'slices/AppUISlice';

function getInitialState() {
  return {
    isEditing: false,
    data: null,
  };
}

export const EditSecretUISlice = createSlice({
  name: 'EditSecretUI',
  initialState: getInitialState(),
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
    [updateSecretSuccess]: state => {
      state.isEditing = false;
    },
    [disconnectUserSuccess]: getInitialState,
  },
});

// Action creators are generated for each case reducer function
export const { updateData, changeField } = EditSecretUISlice.actions;

export default EditSecretUISlice.reducer;
