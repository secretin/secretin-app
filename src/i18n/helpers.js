import { getSupportedBrowserLocale } from './strings';
import moment from 'moment';
import 'moment/locale/fr';

export const getLocale = () =>
  localStorage.getItem('defaultLanguage') || getSupportedBrowserLocale();

export const setMomentLocale = () => moment.locale(getLocale());

setMomentLocale();
