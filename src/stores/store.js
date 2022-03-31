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
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['AppUI/onLoginUserProgress', 'AppUI/loginUserSuccess'],
        // Ignore these paths in the state
        ignoredPaths: ['AppUI.currentUser', 'Metadata.metadata'],
      },
    }),
});
