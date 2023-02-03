import { createAction, props } from '@ngrx/store';
import { Station } from 'src/models/station';

export const updateCurrentStation = createAction(
  '[Station List] updateCurrentStation',
  props<Station>()
);

export const loadTempValuesSuccess = createAction(
  '[Current Station] loadTempValuesSuccess',
  props<any>()
);

export const loadTempValuesFailure = createAction(
  '[Current Station] loadTempValuesFailure',
  props<any>()
);

export const searchForStations = createAction(
  '[Station List] search for Stations',
  props<any>()
);

export const updateStationList = createAction(
  '[Station List] update Station List',
  props<any>()
);
