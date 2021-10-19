import { configureStore } from '@reduxjs/toolkit';
import AppUIReducer from '../slices/AppUISlice';
import EditSecretUIReducer from '../slices/EditSecretUISlice';
import MetadataReducer from '../slices/MetadataSlice';
import NewSecretUIReducer from '../slices/NewSecretUISlice';
import ShowSecretUIReducer from '../slices/ShowSecretUISlice';
import OptionsReducer from '../slices/OptionsSlice';
import ImportReducer from '../slices/ImportSlice';

export default configureStore({
  reducer: {
    AppUI: AppUIReducer,
    EditSecretUI: EditSecretUIReducer,
    Metadata: MetadataReducer,
    NewSecretUI: NewSecretUIReducer,
    ShowSecretUI: ShowSecretUIReducer,
    Options: OptionsReducer,
    Import: ImportReducer,
  },
});
